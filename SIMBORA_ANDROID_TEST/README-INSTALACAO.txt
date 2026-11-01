================================================================================
                    SIMBORA MOBILIDADE URBANA & INTERMUNICIPAL
                       GUIA RÁPIDO DE INSTALAÇÃO DOS APKs
================================================================================

PROJETO: SIMBORA (Alagoas, Brasil)
VERSÃO: 1.0.0 (Release de Testes End-to-End em Aparelhos Físicos)
DATA: 31 de Outubro de 2026
IP DO BACKEND LOCAL: http://192.168.3.5:3001

ARQUIVOS INCLUÍDOS NESTA PASTA:
1. SIMBORA-PASSAGEIRO-TEST.apk   -> Aplicativo para o Celular do Passageiro
2. SIMBORA-MOTORISTA-TEST.apk    -> Aplicativo para o Celular do Motorista
3. GUIA-TESTE-2-CELULARES.md     -> Roteiro passo a passo do teste entre 2 celulares
4. BACKEND-LOCAL-SETUP.md        -> Como manter e verificar o backend no Windows
5. BUILD-REPORT.md               -> Relatório técnico detalhado da compilação dos APKs
6. SIMBORA_ANDROID_TEST.zip      -> Pacote completo compactado para envio ao Google Drive

--------------------------------------------------------------------------------
PASSO 1: TRANSFERIR OS ARQUIVOS PARA OS CELULARES
--------------------------------------------------------------------------------

Você pode enviar os APKs para os dois celulares de qualquer uma das seguintes formas:

OPÇÃO A (RECOMENDADA - GOOGLE DRIVE):
  1. No seu computador, abra o Google Drive no navegador (drive.google.com).
  2. Arraste e solte o arquivo "SIMBORA_ANDROID_TEST.zip" ou a pasta inteira.
  3. No Celular 1 (Passageiro), abra o app Google Drive e baixe:
     -> SIMBORA-PASSAGEIRO-TEST.apk
  4. No Celular 2 (Motorista), abra o app Google Drive e baixe:
     -> SIMBORA-MOTORISTA-TEST.apk

OPÇÃO B (CABO USB):
  1. Conecte o celular ao computador via cabo USB.
  2. No celular, selecione "Transferência de Arquivos / MTP".
  3. Copie o APK correspondente para a pasta "Download" da memória interna.

OPÇÃO C (WHATSAPP WEB / TELEGRAM):
  1. Abra o WhatsApp Web no navegador do seu computador.
  2. Envie os arquivos APK como "Documento" para você mesmo ou para o contato do celular.
  3. Baixe e toque no arquivo no celular.

--------------------------------------------------------------------------------
PASSO 2: HABILITAR A INSTALAÇÃO DE FONTES DESCONHECIDAS NO ANDROID
--------------------------------------------------------------------------------

Como se trata de um APK de teste em desenvolvimento direto (não baixado da Play Store):

1. Ao tocar no arquivo .apk baixado, o Android exibirá:
   "Para sua segurança, seu smartphone não tem permissão para instalar apps desconhecidos desta fonte."
2. Toque em "Configurações".
3. Ative a chave: "Permitir desta fonte" (Chrome, Drive, WhatsApp ou Gerenciador de Arquivos).
4. Volte e toque no botão "Instalar".
5. Se aparecer o aviso do Google Play Protect ("Bloqueado pelo Play Protect / App não reconhecido"):
   -> Toque em "Mais detalhes"
   -> Toque em "Instalar assim mesmo (não seguro)" ou "Continuar".
   (Isso é padrão do Android para qualquer app em teste assinado com chave de desenvolvedor).

--------------------------------------------------------------------------------
PASSO 3: PERMISSÕES DO APLICATIVO
--------------------------------------------------------------------------------

Ao abrir cada aplicativo pela primeira vez:
- Conceda a permissão de "Localização" (Durante o uso do app / Permitir o tempo todo).
  -> Isso ativa a integração com o GPS real do aparelho.
- Conceda a permissão de "Câmera e Armazenamento" no app do Motorista (para envio de documentos e fotos de vistoria).

--------------------------------------------------------------------------------
PASSO 4: REQUISITO ESSENCIAL DE REDE (WI-FI)
--------------------------------------------------------------------------------

- O backend NestJS está rodando na sua máquina host Windows no IP local:
  http://192.168.3.5:3001

- Para que os dois celulares conversem com o backend do seu computador:
  -> AMBOS OS CELULARES DEVEM ESTAR CONECTADOS NA MESMA REDE WI-FI DO SEU COMPUTADOR!
  -> Se o IP do seu computador mudar no roteador, ambos os aplicativos possuem
     um botão de engrenagem no topo para trocar o IP manualmente na hora, sem
     precisar reinstalar o aplicativo!

Para mais detalhes sobre o teste conjunto, leia: GUIA-TESTE-2-CELULARES.md
================================================================================
