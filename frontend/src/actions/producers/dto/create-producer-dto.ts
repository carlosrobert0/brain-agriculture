export interface CreateProducerDto {
  name: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
}