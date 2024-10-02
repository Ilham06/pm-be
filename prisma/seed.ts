// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Permissions
  const readPermission = await prisma.permission.create({
    data: {
      name: 'read',
      description: 'Permission to read data',
    },
  });

  const writePermission = await prisma.permission.create({
    data: {
      name: 'write',
      description: 'Permission to write data',
    },
  });

  const deletePermission = await prisma.permission.create({
    data: {
      name: 'delete',
      description: 'Permission to delete data',
    },
  });

  // Create Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Regular user with limited access',
    },
  });

  // Assign Permissions to Roles using RolePermission
  await prisma.rolePermission.createMany({
    data: [
      {
        role_id: adminRole.id,
        permission_id: readPermission.id,
      },
      {
        role_id: adminRole.id,
        permission_id: writePermission.id,
      },
      {
        role_id: adminRole.id,
        permission_id: deletePermission.id,
      },
      {
        role_id: userRole.id,
        permission_id: readPermission.id,
      },
    ],
  });

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
