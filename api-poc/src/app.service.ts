import { Injectable } from '@nestjs/common';
import { FengService } from './feng/feng.service';
import { VtexService } from './vtex/vtex.service';

@Injectable()
export class AppService {
  constructor(
    private readonly fengService: FengService,
    private readonly vtexService: VtexService,
  ) {}

  async getUserByEmail(email: string) {
    const user = await this.fengService.getUserByEmail(email);

    if (!user['res']['contrato']) {
      const response = {
        email: email,
        status: 'Não Sócio',
      };
      return response;
    }

    const dataVencimentoContrato = new Date(
      user['res']['contrato']['dt_final'],
    );
    const dataAtual = new Date();

    if (dataAtual > dataVencimentoContrato) {
      const response = {
        email: email,
        status: 'Não Sócio',
      };

      return response;
    }

    const response = {
      email: email,
      status: 'Sócio',
      plano: user['res']['contrato']['plano'],
      estado_ativacao: user['res']['contrato']['estado_ativacao'],
    };

    await this.vtexService.updateClient(user['res']);
    return response;
  }
}
