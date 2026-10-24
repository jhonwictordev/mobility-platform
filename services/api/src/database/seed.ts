import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import {
  User,
  UserRole,
  Driver,
  DriverStatus,
  ApprovalStatus,
  Vehicle,
  VehicleCategory,
  Trip,
  TripStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  AuditLog,
  DriverLocation,
  Document,
} from './entities';

async function seed() {
  console.log('🌱 Starting Mobility Platform database seed...');

  const dbPath = path.resolve(__dirname, '../../../../mobility.sqlite');
  console.log(`Database path: ${dbPath}`);

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [
      User,
      Driver,
      Vehicle,
      Trip,
      DriverLocation,
      Payment,
      AuditLog,
      Document,
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected.');

  const userRepo = dataSource.getRepository(User);
  const driverRepo = dataSource.getRepository(Driver);
  const vehicleRepo = dataSource.getRepository(Vehicle);
  const tripRepo = dataSource.getRepository(Trip);
  const paymentRepo = dataSource.getRepository(Payment);

  // Check if already seeded
  const userCount = await userRepo.count();
  if (userCount > 0) {
    console.log(`Database already contains ${userCount} users. Skipping seed.`);
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('replace_with_test_password', 10);

  // 1. Admin
  await userRepo.save(
    userRepo.create({
      name: 'Administrador do Sistema',
      email: 'admin@mobility.com',
      password: hashedPassword,
      phone: '+5511999990000',
      role: UserRole.ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    }),
  );

  // 2. Passengers
  const passenger1 = await userRepo.save(
    userRepo.create({
      name: 'Mariana Silva',
      email: 'mariana@example.com',
      password: hashedPassword,
      phone: '+5511988881111',
      role: UserRole.PASSENGER,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    }),
  );

  await userRepo.save(
    userRepo.create({
      name: 'Lucas Ferreira',
      email: 'lucas@example.com',
      password: hashedPassword,
      phone: '+5511988882222',
      role: UserRole.PASSENGER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    }),
  );

  // 3. Drivers & Vehicles (São Paulo coordinates: MASP / Av. Paulista center ~ -23.5615, -46.6559)
  const driverData = [
    {
      name: 'Carlos Oliveira',
      email: 'carlos.motorista@mobility.com',
      phone: '+5511977773333',
      license: 'CNH1234567890',
      status: DriverStatus.ONLINE,
      rating: 4.9,
      trips: 342,
      lat: -23.562,
      lng: -46.654,
      vehicle: {
        make: 'Toyota',
        model: 'Corolla Hybrid',
        year: 2023,
        color: 'Prata',
        plateNumber: 'BRA2E19',
        category: VehicleCategory.COMFORT,
        seats: 4,
        approved: true,
      },
    },
    {
      name: 'Roberto Santos',
      email: 'roberto.motorista@mobility.com',
      phone: '+5511977774444',
      license: 'CNH2345678901',
      status: DriverStatus.ONLINE,
      rating: 4.8,
      trips: 189,
      lat: -23.565,
      lng: -46.651,
      vehicle: {
        make: 'Chevrolet',
        model: 'Onix Plus',
        year: 2022,
        color: 'Branco',
        plateNumber: 'RIO4A22',
        category: VehicleCategory.ECONOMY,
        seats: 4,
        approved: true,
      },
    },
    {
      name: 'Amanda Souza',
      email: 'amanda.motorista@mobility.com',
      phone: '+5511977775555',
      license: 'CNH3456789012',
      status: DriverStatus.ONLINE,
      rating: 5.0,
      trips: 82,
      lat: -23.558,
      lng: -46.659,
      vehicle: {
        make: 'BMW',
        model: '320i M Sport',
        year: 2024,
        color: 'Preto',
        plateNumber: 'SPX9Z99',
        category: VehicleCategory.PREMIUM,
        seats: 4,
        approved: true,
      },
    },
    {
      name: 'Fernando Lima',
      email: 'fernando.motorista@mobility.com',
      phone: '+5511977776666',
      license: 'CNH4567890123',
      status: DriverStatus.OFFLINE,
      rating: 4.7,
      trips: 410,
      lat: -23.57,
      lng: -46.645,
      vehicle: {
        make: 'Hyundai',
        model: 'HB20S',
        year: 2021,
        color: 'Cinza',
        plateNumber: 'KLU7F88',
        category: VehicleCategory.ECONOMY,
        seats: 4,
        approved: true,
      },
    },
  ];

  for (const item of driverData) {
    const user = await userRepo.save(
      userRepo.create({
        name: item.name,
        email: item.email,
        password: hashedPassword,
        phone: item.phone,
        role: UserRole.DRIVER,
      }),
    );

    const driver = await driverRepo.save(
      driverRepo.create({
        userId: user.id,
        licenseNumber: item.license,
        status: item.status,
        approvalStatus: ApprovalStatus.APPROVED,
        rating: item.rating,
        totalTrips: item.trips,
        currentLat: item.lat,
        currentLng: item.lng,
      }),
    );

    await vehicleRepo.save(
      vehicleRepo.create({
        driverId: driver.id,
        ...item.vehicle,
      }),
    );
  }

  // 4. Sample Completed Trips
  const firstDriver = await driverRepo.findOne({ where: {} });
  if (firstDriver) {
    const completedTrip = await tripRepo.save(
      tripRepo.create({
        passengerId: passenger1.id,
        driverId: firstDriver.id,
        status: TripStatus.COMPLETED,
        originLat: -23.5615,
        originLng: -46.6559,
        originAddress: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
        destLat: -23.5874,
        destLng: -46.6576,
        destAddress: 'Parque Ibirapuera - Portão 3, São Paulo - SP',
        distanceKm: 3.8,
        durationMin: 14,
        fare: 18.5,
        category: VehicleCategory.COMFORT,
        requestedAt: new Date(Date.now() - 3600000),
        acceptedAt: new Date(Date.now() - 3550000),
        startedAt: new Date(Date.now() - 3300000),
        completedAt: new Date(Date.now() - 2460000),
        rating: 5,
        review: 'Excelente motorista, carro impecável e ar condicionado ligado.',
      }),
    );

    await paymentRepo.save(
      paymentRepo.create({
        tripId: completedTrip.id,
        amount: 18.5,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transactionId: 'test_tx_seed_001',
      }),
    );
  }

  console.log('✅ Seed completed successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
