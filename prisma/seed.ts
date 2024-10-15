// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const permissions = [
  // Module Event (CRUD)
  {
    code: "EVENT__CREATE",
    name: "Create Event",
    description: "Membuat event baru"
  },
  {
    code: "EVENT__GET_ALL",
    name: "Get All Events",
    description: "Mengambil semua data event"
  },
  {
    code: "EVENT__DETAIL",
    name: "Event Detail",
    description: "Melihat detail dari event"
  },
  {
    code: "EVENT__EDIT",
    name: "Edit Event",
    description: "Mengedit informasi event"
  },
  {
    code: "EVENT__DELETE",
    name: "Delete Event",
    description: "Menghapus event"
  },
  
  // Additional Event Actions
  {
    code: "EVENT__UPDATE_STATUS",
    name: "Update Event Status",
    description: "Mengubah status event"
  },
  {
    code: "EVENT__ADD_ACTIVITY",
    name: "Add Event Activity",
    description: "Menambahkan aktivitas pada event"
  },
  {
    code: "EVENT__UPDATE_ACTIVITY",
    name: "Update Event Activity",
    description: "Mengubah aktivitas pada event"
  },

  // Event Documents
  {
    code: "EVENT__ADD_DOCUMENT",
    name: "Add Event Document",
    description: "Menambahkan dokumen pada event"
  },
  {
    code: "EVENT__APPROVE_DOCUMENT",
    name: "Approve Event Document",
    description: "Menyetujui dokumen pada event"
  },

  // Event Budget
  {
    code: "EVENT__VIEW_BUDGET",
    name: "View Event Budget",
    description: "Melihat budget event"
  },

  // Event Transactions
  {
    code: "EVENT__ADD_TRANSACTION",
    name: "Add Event Transaction",
    description: "Menambahkan transaksi pada event"
  },
  {
    code: "EVENT__APPROVE_TRANSACTION",
    name: "Approve Event Transaction",
    description: "Menyetujui transaksi pada event"
  },
  {
    code: "EVENT__DOWNLOAD_TRANSACTION_REPORT",
    name: "Download Event Transaction Report",
    description: "Mengunduh laporan transaksi event"
  },

  // Event Reports
  {
    code: "EVENT__CREATE_REPORT",
    name: "Create Event Report",
    description: "Membuat laporan event"
  },
  {
    code: "EVENT__VIEW_REPORT",
    name: "View Event Report",
    description: "Melihat laporan event"
  },
  {
    code: "EVENT__VIEW_REPORT_DETAIL",
    name: "View Event Report Detail",
    description: "Melihat detail dari laporan event"
  },
  {
    code: "EVENT__GENERATE_REPORT",
    name: "Generate Event Report",
    description: "Menghasilkan laporan event"
  },
  {
    code: "EVENT__EDIT_REPORT",
    name: "Edit Event Report",
    description: "Mengedit laporan event"
  },
  {
    code: "EVENT__DELETE_REPORT",
    name: "Delete Event Report",
    description: "Menghapus laporan event"
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
