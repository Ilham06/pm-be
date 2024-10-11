// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const permissions = [
  // Module User
  {
    code: "USER__CREATE",
    name: "Create User",
    description: "Membuat user baru"
  },
  {
    code: "USER__GET_ALL",
    name: "Get All Users",
    description: "Mengambil semua data user"
  },
  {
    code: "USER__DETAIL",
    name: "User Detail",
    description: "Melihat detail dari user"
  },
  {
    code: "USER__EDIT",
    name: "Edit User",
    description: "Mengedit informasi user"
  },
  {
    code: "USER__DELETE",
    name: "Delete User",
    description: "Menghapus user"
  },
  {
    code: "USER__ACTION",
    name: "Action User",
    description: "Merubah status user"
  },

  // Module Client
  {
    code: "CLIENT__CREATE",
    name: "Create Client",
    description: "Membuat client baru"
  },
  {
    code: "CLIENT__GET_ALL",
    name: "Get All Clients",
    description: "Mengambil semua data client"
  },
  {
    code: "CLIENT__DETAIL",
    name: "Client Detail",
    description: "Melihat detail dari client"
  },
  {
    code: "CLIENT__EDIT",
    name: "Edit Client",
    description: "Mengedit informasi client"
  },
  {
    code: "CLIENT__DELETE",
    name: "Delete Client",
    description: "Menghapus client"
  },

  // Module Role
  {
    code: "ROLE__CREATE",
    name: "Create Role",
    description: "Membuat role baru"
  },
  {
    code: "ROLE__GET_ALL",
    name: "Get All Roles",
    description: "Mengambil semua data role"
  },
  {
    code: "ROLE__DETAIL",
    name: "Role Detail",
    description: "Melihat detail dari role"
  },
  {
    code: "ROLE__EDIT",
    name: "Edit Role",
    description: "Mengedit informasi role"
  },
  {
    code: "ROLE__DELETE",
    name: "Delete Role",
    description: "Menghapus role"
  },

  // Module Bank Account
  {
    code: "BANK_ACCOUNT__CREATE",
    name: "Create Bank Account",
    description: "Membuat rekening bank baru"
  },
  {
    code: "BANK_ACCOUNT__GET_ALL",
    name: "Get All Bank Accounts",
    description: "Mengambil semua data rekening bank"
  },
  {
    code: "BANK_ACCOUNT__DETAIL",
    name: "Bank Account Detail",
    description: "Melihat detail dari rekening bank"
  },
  {
    code: "BANK_ACCOUNT__EDIT",
    name: "Edit Bank Account",
    description: "Mengedit informasi rekening bank"
  },
  {
    code: "BANK_ACCOUNT__DELETE",
    name: "Delete Bank Account",
    description: "Menghapus rekening bank"
  }
];


async function main() {
  // Create Permissions
  const storePermission = await prisma.permission.createMany({data: permissions})

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
