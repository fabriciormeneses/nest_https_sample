import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthDTO } from 'src/dto/auth.dto';

@Injectable()
export class FengService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAuthToken(): Promise<AuthDTO> {
    try {
      const data = await firstValueFrom(
        this.httpService
          .post(this.configService.get('api.fengAuthUrl'), {
            login: this.configService.get('api.fengLogin'),
            password: this.configService.get('api.fengPass'),
          })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      ).catch(() => {
        throw { statusCode: 503, message: 'Unable to get Token' };
      });

      return {
        type: data['res']['auth']['type'],
        token: data['res']['auth']['token'],
      };
    } catch (error) {
      throw { statusCode: 503, message: 'Unable to get Token' };
    }
  }

  async getAuthCache(): Promise<Promise<AuthDTO>> {
    const token: string = await this.cacheManager.get('feng_token');
    const type: string = await this.cacheManager.get('feng_type');

    const auth: AuthDTO = { type, token };

    return auth;
  }

  async setAuthCache(auth: AuthDTO) {
    await this.cacheManager.set(
      'feng_token',
      auth.token,
      this.configService.get('tokenCacheTime'),
    );
    await this.cacheManager.set(
      'feng_type',
      auth.type,
      this.configService.get('tokenCacheTime'),
    );
  }

  async getUserByEmail(email: string) {
    try {
      let auth = await this.getAuthCache();
      if (!auth.token) {
        auth = await this.getAuthToken();
        this.setAuthCache(auth);
      }
      const headersRequest = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${auth.type} ${auth.token}`,
        },
      };
      const apiUrl = this.configService.get('api.fengApiUrl') + email;
      const user = firstValueFrom(
        this.httpService.get(apiUrl, headersRequest).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      ).catch(async () => {
        auth = await this.getAuthCache();
        if (auth.token) {
          this.cacheManager.del('feng_token');
          this.cacheManager.del('feng_type');
          return await this.getUserByEmail(email);
        } else {
          throw { statusCode: 503, message: 'Unable to get User Information' };
        }
      });
      return user;
    } catch (error) {
      throw { statusCode: 503, message: 'Unable to get User Information' };
    }
  }
}
