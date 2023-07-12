import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { UserDTO } from 'src/dto/user.dto';
import { VtexDTO } from 'src/dto/vtex.dto';

@Injectable()
export class VtexService {
  private readonly logger = new Logger(VtexService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async getClientId(email): Promise<VtexDTO> {
    try {
      const headersRequest = {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/vnd.vtex.ds.v10+json',
          'rest-range': 'resources=0-1',
          'x-vtex-api-appkey': this.configService.get('vtex.appKey'),
          'x-vtex-api-apptoken': this.configService.get('vtex.appToken'),
        },
      };
      const searchUrl = `${this.configService.get(
        'vtex.clSearchUrl',
      )}email=${email}&_fields=id`;
      const data = await firstValueFrom(
        this.httpService.get(searchUrl, headersRequest).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
      return data[0];
    } catch (error) {
      throw {
        statusCode: 503,
        message: 'Unable to get Vtex Client Identification',
      };
    }
  }

  async updateClient(user: UserDTO) {
    const headersRequest = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vtex.ds.v10+json',
        'X-VTEX-API-AppKey': this.configService.get('vtex.appKey'),
        'X-VTEX-API-AppToken': this.configService.get('vtex.appToken'),
      },
    };
    const email = user.email;
    const plan = user.contrato.plano;
    const contract = user.contrato.estado_ativacao;
    const validMembership = contract == 'Ativo' ? true : false;
    const response = await this.getClientId(email);
    const clientId = response ? response.id : null;
    const clientInfo = JSON.stringify({
      email,
      clusterStatus: true,
      cluster: plan,
      clusterActiveState: validMembership,
    });
    const patchURL = clientId
      ? this.configService.get('vtex.clPathUrl') + clientId
      : this.configService.get('vtex.clPathUrl');

    const data = lastValueFrom(
      this.httpService.patch(patchURL, clientInfo, headersRequest).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    ).catch((error) => {
      throw {
        statusCode: error.statusCode,
        message: 'Unable to Update CL ' + error,
      };
    });

    return data;
  }
}
