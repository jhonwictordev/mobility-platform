import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDriverStore } from '../stores/driverStore';

interface RequiredDoc {
  type: string;
  title: string;
  desc: string;
}

const REQUIRED_DOCS: RequiredDoc[] = [
  {
    type: 'drivers_license',
    title: 'CNH com EAR',
    desc: 'Carteira Nacional de Habilitação com observação de Atividade Remunerada (EAR)',
  },
  {
    type: 'vehicle_registration',
    title: 'CRLV do Veículo',
    desc: 'Certificado de Registro e Licenciamento do Veículo atualizado',
  },
  {
    type: 'background_check',
    title: 'Atestado de Antecedentes Criminais',
    desc: 'Certidão emitida nos últimos 90 dias pelos órgãos competentes',
  },
  {
    type: 'vehicle_insurance',
    title: 'Comprovante / Seguro APP',
    desc: 'Apólice de Seguro para Acidentes Pessoais a Passageiros',
  },
];

export default function DocumentsScreen() {
  const {
    driver,
    documents,
    vehicles,
    fetchDocuments,
    uploadDocument,
    fetchVehicles,
    addVehicle,
    fetchDriverProfile,
  } = useDriverStore();

  const [loading, setLoading] = useState(false);

  // Upload modal state
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<RequiredDoc | null>(null);
  const [docFileUrl, setDocFileUrl] = useState('');

  // Add vehicle modal state
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2023');
  const [color, setColor] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [renavam, setRenavam] = useState('');
  const [category, setCategory] = useState('economy');

  useEffect(() => {
    loadData();
  }, [driver?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDriverProfile(),
        fetchDocuments(),
        fetchVehicles(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpload = (doc: RequiredDoc) => {
    setSelectedDocType(doc);
    setDocFileUrl(`https://storage.simbora.app/docs/${driver?.id || 'drv'}/${doc.type}_${Date.now()}.pdf`);
    setUploadModalVisible(true);
  };

  const handleSubmitUpload = async () => {
    if (!selectedDocType || !docFileUrl.trim()) {
      Alert.alert('Erro', 'Por favor insira a URL ou comprovante do documento');
      return;
    }
    try {
      await uploadDocument(selectedDocType.type, docFileUrl.trim());
      Alert.alert('Sucesso', 'Documento enviado para análise da equipe SIMBORA!');
      setUploadModalVisible(false);
      setSelectedDocType(null);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao enviar documento');
    }
  };

  const handleCreateVehicle = async () => {
    if (!make.trim() || !model.trim() || !plateNumber.trim()) {
      Alert.alert('Erro', 'Preencha marca, modelo e placa do veículo');
      return;
    }

    try {
      await addVehicle({
        make: make.trim(),
        model: model.trim(),
        year: parseInt(year, 10) || 2022,
        color: color.trim() || 'Branco',
        plateNumber: plateNumber.trim().toUpperCase(),
        renavam: renavam.trim() || undefined,
        category,
        seats: 4,
      });
      Alert.alert('Sucesso', 'Veículo cadastrado e enviado para vistoria!');
      setVehicleModalVisible(false);
      setMake('');
      setModel('');
      setColor('');
      setPlateNumber('');
      setRenavam('');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao cadastrar veículo');
    }
  };

  const isApproved = driver?.approvalStatus === 'approved';
  const isRejected = driver?.approvalStatus === 'rejected';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Documentos e Vistoria</Text>
      <Text style={styles.subtitle}>
        Envie seus comprovantes para verificação e habilitação de corridas no SIMBORA.
      </Text>

      {/* Driver Status Banner */}
      <View
        style={[
          styles.statusBanner,
          isApproved
            ? styles.bannerApproved
            : isRejected
            ? styles.bannerRejected
            : styles.bannerPending,
        ]}
      >
        <Text style={styles.bannerIcon}>
          {isApproved ? '✅' : isRejected ? '❌' : '⏳'}
        </Text>
        <View style={styles.bannerText}>
          <Text
            style={[
              styles.bannerTitle,
              {
                color: isApproved
                  ? '#065F46'
                  : isRejected
                  ? '#991B1B'
                  : '#92400E',
              },
            ]}
          >
            {isApproved
              ? 'Conta 100% Aprovada'
              : isRejected
              ? 'Cadastro Não Aprovado'
              : 'Cadastro em Análise'}
          </Text>
          <Text
            style={[
              styles.bannerDesc,
              {
                color: isApproved
                  ? '#047857'
                  : isRejected
                  ? '#B91C1C'
                  : '#B45309',
              },
            ]}
          >
            {isApproved
              ? 'Você está apto a ficar ONLINE e receber chamadas em Alagoas.'
              : isRejected
              ? driver?.rejectionReason || 'Verifique seus documentos ou entre em contato com o suporte.'
              : 'Nossa equipe está validando seus documentos. Em breve você poderá aceitar corridas.'}
          </Text>
        </View>
      </View>

      {loading && (
        <ActivityIndicator size="small" color="#00C975" style={{ marginBottom: 15 }} />
      )}

      {/* Required Documents Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Documentação Obrigatória</Text>
        <TouchableOpacity onPress={loadData}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docList}>
        {REQUIRED_DOCS.map((req) => {
          const uploaded = documents?.find((d: any) => d.type === req.type);
          const status = uploaded?.status || 'NOT_SUBMITTED';

          let statusLabel = 'NÃO ENVIADO';
          let statusColor = '#6B7280';
          let bgColor = '#F3F4F6';

          if (status === 'approved') {
            statusLabel = 'APROVADO';
            statusColor = '#10B981';
            bgColor = '#D1FAE5';
          } else if (status === 'pending') {
            statusLabel = 'EM ANÁLISE';
            statusColor = '#F59E0B';
            bgColor = '#FEF3C7';
          } else if (status === 'rejected') {
            statusLabel = 'REJEITADO';
            statusColor = '#EF4444';
            bgColor = '#FEE2E2';
          }

          return (
            <View key={req.type} style={styles.docCard}>
              <View style={styles.docHeader}>
                <Text style={styles.docTitle}>{req.title}</Text>
                <View style={[styles.badge, { backgroundColor: bgColor }]}>
                  <Text style={[styles.badgeText, { color: statusColor }]}>
                    {statusLabel}
                  </Text>
                </View>
              </View>

              <Text style={styles.docDesc}>{req.desc}</Text>

              {uploaded?.reviewNotes && (
                <Text style={styles.notesText}>
                  Nota da vistoria: {uploaded.reviewNotes}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  status === 'approved' && styles.uploadBtnOutline,
                ]}
                onPress={() => handleOpenUpload(req)}
              >
                <Text
                  style={[
                    styles.uploadBtnText,
                    status === 'approved' && { color: '#00C975' },
                  ]}
                >
                  {status === 'approved'
                    ? 'Reenviar Atualização'
                    : status === 'pending'
                    ? 'Substituir Documento'
                    : 'Enviar Documento'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Vehicles Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Veículos Cadastrados</Text>
        <TouchableOpacity
          style={styles.addVehicleBtn}
          onPress={() => setVehicleModalVisible(true)}
        >
          <Text style={styles.addVehicleBtnText}>+ Novo Veículo</Text>
        </TouchableOpacity>
      </View>

      {(!vehicles || vehicles.length === 0) ? (
        <View style={styles.emptyVehicles}>
          <Text style={styles.emptyVehiclesText}>
            Nenhum veículo cadastrado. Cadastre seu veículo para começar.
          </Text>
        </View>
      ) : (
        vehicles.map((v: any) => (
          <View key={v.id} style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleName}>
                {v.make} {v.model} ({v.year})
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: v.approved ? '#D1FAE5' : '#FEF3C7' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: v.approved ? '#10B981' : '#F59E0B' },
                  ]}
                >
                  {v.approved ? 'VISTORIADO' : 'EM VISTORIA'}
                </Text>
              </View>
            </View>

            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleDetailText}>
                Placa: <Text style={styles.bold}>{v.plateNumber}</Text>
              </Text>
              <Text style={styles.vehicleDetailText}>
                Cor: <Text style={styles.bold}>{v.color}</Text>
              </Text>
              <Text style={styles.vehicleDetailText}>
                Categoria: <Text style={styles.bold}>{v.category?.toUpperCase()}</Text>
              </Text>
            </View>
            {v.inspectionNotes && (
              <Text style={styles.notesText}>Vistoria: {v.inspectionNotes}</Text>
            )}
          </View>
        ))
      )}

      <View style={{ height: 60 }} />

      {/* Document Upload Modal */}
      <Modal visible={uploadModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enviar Documento</Text>
            <Text style={styles.modalSubtitle}>
              {selectedDocType?.title}
            </Text>

            <Text style={styles.inputLabel}>URL ou Link do Arquivo/Foto:</Text>
            <TextInput
              style={styles.input}
              value={docFileUrl}
              onChangeText={setDocFileUrl}
              placeholder="https://..."
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setUploadModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleSubmitUpload}
              >
                <Text style={styles.modalConfirmText}>Confirmar Envio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal visible={vehicleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContentScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cadastrar Novo Veículo</Text>
              <Text style={styles.modalSubtitle}>
                Dados do automóvel para prestação de serviço
              </Text>

              <Text style={styles.inputLabel}>Marca:</Text>
              <TextInput
                style={styles.input}
                value={make}
                onChangeText={setMake}
                placeholder="Ex: Toyota, Chevrolet, Renault"
              />

              <Text style={styles.inputLabel}>Modelo:</Text>
              <TextInput
                style={styles.input}
                value={model}
                onChangeText={setModel}
                placeholder="Ex: Corolla, Onix, Kwid"
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Ano:</Text>
                  <TextInput
                    style={styles.input}
                    value={year}
                    onChangeText={setYear}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Cor:</Text>
                  <TextInput
                    style={styles.input}
                    value={color}
                    onChangeText={setColor}
                    placeholder="Ex: Prata"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Placa (Mercosul ou Padrão):</Text>
              <TextInput
                style={styles.input}
                value={plateNumber}
                onChangeText={setPlateNumber}
                placeholder="Ex: BRA2E19"
                autoCapitalize="characters"
              />

              <Text style={styles.inputLabel}>Renavam (Opcional):</Text>
              <TextInput
                style={styles.input}
                value={renavam}
                onChangeText={setRenavam}
                placeholder="Ex: 00123456789"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Categoria:</Text>
              <View style={styles.categoryPicker}>
                {['economy', 'comfort', 'premium'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      category === cat && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextSelected,
                      ]}
                    >
                      {cat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setVehicleModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleCreateVehicle}
                >
                  <Text style={styles.modalConfirmText}>Cadastrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerApproved: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  bannerPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  bannerRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  bannerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  bannerDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00C975',
  },
  docList: {
    gap: 12,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  docDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  notesText: {
    fontSize: 12,
    color: '#D97706',
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  uploadBtn: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#00C975',
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadBtnOutline: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  addVehicleBtn: {
    backgroundColor: '#00C975',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addVehicleBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  emptyVehicles: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyVehiclesText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleDetails: {
    flexDirection: 'row',
    gap: 14,
  },
  vehicleDetailText: {
    fontSize: 13,
    color: '#4B5563',
  },
  bold: {
    fontWeight: '700',
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContentScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  categoryPicker: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 14,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  categoryOptionSelected: {
    backgroundColor: '#00C975',
    borderColor: '#00C975',
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  categoryOptionTextSelected: {
    color: '#000000',
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#00C975',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
});
