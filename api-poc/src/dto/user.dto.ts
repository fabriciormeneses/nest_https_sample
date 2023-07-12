export class UserDTO {
  idpessoa?: string;
  nome?: string;
  primeiro_nome?: string;
  ultimo_nome?: string;
  dtnascimento?: Date;
  celular?: string;
  email: string;
  sexo?: string;
  cpf?: string;
  status: string;
  idpessoa_responsavel?: string;
  contrato?: {
    plano?: string;
    idplano?: string;
    dt_inicial?: Date;
    dt_final?: Date;
    duracao_plano?: number;
    cartoes_ingresso?: any;
    estado_ativacao?: string;
  };
  dt_admissao?: Date;
  dependentes?: string;
  responsavel?: string;
}
