import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const pacientes = await prisma.paciente.findMany();
  console.log('Pacientes:', pacientes.length);
  const usuarios = await prisma.usuario.findMany();
  console.log('Usuarios:', usuarios.length);
  if (usuarios.length > 0 && pacientes.length > 0) {
    console.log('Usuario 0 clinicaId:', usuarios[0].clinicaId);
    console.log('Paciente 0 clinicaId:', pacientes[0].clinicaId);
  }
}
run().finally(() => prisma.$disconnect());
