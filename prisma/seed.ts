import { PrismaClient, TicketStatus, ContactMethod } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    slug: "hotels-resorts",
    nameEn: "Hotels & Resorts",
    nameAr: "حجوزات الفنادق والمنتجعات",
    descEn: "Handpicked stays at the world's finest hotels and resorts, booked and negotiated for you.",
    descAr: "إقامات مختارة بعناية في أرقى الفنادق والمنتجعات حول العالم، نحجزها ونتفاوض عليها من أجلك.",
    image: "/images/services/hotels-resorts.jpg",
    order: 1,
  },
  {
    slug: "apartments-suites",
    nameEn: "Apartments & Hotel Suites",
    nameAr: "الشقق والأجنحة الفندقية",
    descEn: "Serviced apartments and premium hotel suites for longer, more private stays.",
    descAr: "شقق مخدومة وأجنحة فندقية فاخرة لإقامات أطول وأكثر خصوصية.",
    image: "/images/services/apartments-suites.jpg",
    order: 2,
  },
  {
    slug: "yachts",
    nameEn: "Yacht Charter & Rental",
    nameAr: "حجز وتأجير اليخوت",
    descEn: "Private yacht charters with full crew, itinerary planning, and onboard hospitality.",
    descAr: "تأجير يخوت خاصة بطاقم كامل مع تخطيط المسار وخدمات الضيافة على متن اليخت.",
    image: "/images/services/yachts.jpg",
    order: 3,
  },
  {
    slug: "car-rental",
    nameEn: "Car Rental",
    nameAr: "تأجير السيارات",
    descEn: "Luxury and executive vehicles, with or without chauffeur, delivered where you need them.",
    descAr: "سيارات فاخرة وتنفيذية، مع سائق أو بدونه، تصل إلى حيث تحتاجها.",
    image: "/images/services/car-rental.jpg",
    order: 4,
  },
  {
    slug: "conferences-events",
    nameEn: "Conferences & Corporate Events",
    nameAr: "تنظيم المؤتمرات والفعاليات",
    descEn: "End-to-end planning and production for conferences and corporate events.",
    descAr: "تخطيط وتنفيذ متكامل للمؤتمرات والفعاليات المؤسسية من البداية إلى النهاية.",
    image: "/images/services/conferences-events.jpg",
    order: 5,
  },
  {
    slug: "parties-festivals",
    nameEn: "Parties & Festivals",
    nameAr: "تنظيم الحفلات والمهرجانات",
    descEn: "Unforgettable private parties and festivals, designed and managed down to the last detail.",
    descAr: "حفلات خاصة ومهرجانات لا تُنسى، نصممها وندير كل تفاصيلها.",
    image: "/images/services/parties-festivals.jpg",
    order: 6,
  },
  {
    slug: "exhibitions",
    nameEn: "Exhibitions Management",
    nameAr: "تنظيم وإدارة المعارض",
    descEn: "Exhibition planning, stand production, and on-site management for brands and organizers.",
    descAr: "تخطيط المعارض وتجهيز الأجنحة والإدارة الميدانية للعلامات التجارية والمنظمين.",
    image: "/images/services/exhibitions.jpg",
    order: 7,
  },
  {
    slug: "business-services",
    nameEn: "Business Services",
    nameAr: "خدمات رجال الأعمال",
    descEn: "Executive travel support: meetings, protocol, transport, and business logistics.",
    descAr: "دعم سفر تنفيذي: اجتماعات، مراسم، تنقلات، وخدمات لوجستية للأعمال.",
    image: "/images/services/business-services.jpg",
    order: 8,
  },
  {
    slug: "leisure-tourism",
    nameEn: "Leisure & Tourism",
    nameAr: "الخدمات الترفيهية والسياحية",
    descEn: "Curated leisure experiences, tours, and activities tailored to your taste.",
    descAr: "تجارب ترفيهية وجولات وأنشطة سياحية منسقة حسب ذوقك.",
    image: "/images/services/leisure-tourism.jpg",
    order: 9,
  },
];

// MDN-XXXXX — A-Z0-9, no ambiguous chars (I, L, O, 0, 1)
const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateReferenceCode(): string {
  let code = "MDN-";
  for (let i = 0; i < 5; i++) {
    code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return code;
}

// Status flow: RECEIVED → IN_PROGRESS → PREPARING_OFFER → CONTACTED →
// (AGREED | NO_AGREEMENT) → PAID. Every change creates a StatusEvent.
function statusPath(target: TicketStatus): TicketStatus[] {
  const mainline: TicketStatus[] = [
    TicketStatus.RECEIVED,
    TicketStatus.IN_PROGRESS,
    TicketStatus.PREPARING_OFFER,
    TicketStatus.CONTACTED,
  ];
  switch (target) {
    case TicketStatus.NO_AGREEMENT:
      return [...mainline, TicketStatus.NO_AGREEMENT];
    case TicketStatus.AGREED:
      return [...mainline, TicketStatus.AGREED];
    case TicketStatus.PAID:
      return [...mainline, TicketStatus.AGREED, TicketStatus.PAID];
    default:
      return mainline.slice(0, mainline.indexOf(target) + 1);
  }
}

const fakeTickets: Array<{
  serviceSlug: string;
  fullName: string;
  phone: string;
  email: string | null;
  contactMethod: ContactMethod;
  details: string;
  status: TicketStatus;
  adminNotes: string | null;
}> = [
  {
    serviceSlug: "hotels-resorts",
    fullName: "Omar Al-Sayed",
    phone: "+971501234567",
    email: "omar.alsayed@example.com",
    contactMethod: ContactMethod.WHATSAPP,
    details: "Looking for a 5-night stay at a beachfront resort in the Maldives for two adults, mid-October.",
    status: TicketStatus.RECEIVED,
    adminNotes: null,
  },
  {
    serviceSlug: "yachts",
    fullName: "Sarah Mitchell",
    phone: "+447700900123",
    email: "sarah.mitchell@example.com",
    contactMethod: ContactMethod.EMAIL,
    details: "Full-day yacht charter in Dubai Marina for 12 guests, catering included, next month.",
    status: TicketStatus.IN_PROGRESS,
    adminNotes: "Checking availability with two operators.",
  },
  {
    serviceSlug: "car-rental",
    fullName: "خالد المنصوري",
    phone: "+966551112233",
    email: null,
    contactMethod: ContactMethod.PHONE,
    details: "أحتاج سيارة فاخرة مع سائق لمدة أسبوع في الرياض ابتداءً من يوم الأحد القادم.",
    status: TicketStatus.PREPARING_OFFER,
    adminNotes: "Client prefers a black S-Class. Preparing two options.",
  },
  {
    serviceSlug: "conferences-events",
    fullName: "Lina Haddad",
    phone: "+96170123456",
    email: "lina.haddad@example.com",
    contactMethod: ContactMethod.EMAIL,
    details: "Corporate conference for 150 attendees in Beirut, two days in November, need venue and AV production.",
    status: TicketStatus.CONTACTED,
    adminNotes: "Sent venue shortlist, awaiting feedback.",
  },
  {
    serviceSlug: "apartments-suites",
    fullName: "James Carter",
    phone: "+12025550147",
    email: "james.carter@example.com",
    contactMethod: ContactMethod.WHATSAPP,
    details: "Serviced apartment in downtown Dubai for one month, two bedrooms, starting first week of September.",
    status: TicketStatus.AGREED,
    adminNotes: "Agreed on Address Boulevard, monthly rate confirmed.",
  },
  {
    serviceSlug: "parties-festivals",
    fullName: "نور الهاشمي",
    phone: "+971529876543",
    email: "noor.h@example.com",
    contactMethod: ContactMethod.WHATSAPP,
    details: "حفل تخرج خاص لحوالي 80 ضيفًا في أبوظبي مع تنسيق كامل للديكور والضيافة.",
    status: TicketStatus.PAID,
    adminNotes: "Deposit received, vendors booked.",
  },
  {
    serviceSlug: "exhibitions",
    fullName: "Mohammed Farouk",
    phone: "+201001234567",
    email: null,
    contactMethod: ContactMethod.PHONE,
    details: "Need a 60 sqm stand designed and built for a trade exhibition in Cairo this December.",
    status: TicketStatus.NO_AGREEMENT,
    adminNotes: "Budget mismatch — client may return next quarter.",
  },
  {
    serviceSlug: "business-services",
    fullName: "Elena Petrova",
    phone: "+79161234567",
    email: "elena.petrova@example.com",
    contactMethod: ContactMethod.EMAIL,
    details: "Executive itinerary for a 3-day business visit to Dubai: meetings coordination, transport, and translation.",
    status: TicketStatus.IN_PROGRESS,
    adminNotes: null,
  },
  {
    serviceSlug: "leisure-tourism",
    fullName: "عبدالله القحطاني",
    phone: "+966555667788",
    email: "abdullah.q@example.com",
    contactMethod: ContactMethod.WHATSAPP,
    details: "برنامج سياحي عائلي لمدة خمسة أيام في جورجيا لعائلة من ستة أفراد خلال إجازة منتصف الفصل.",
    status: TicketStatus.CONTACTED,
    adminNotes: "Called and discussed itinerary draft.",
  },
  {
    serviceSlug: "hotels-resorts",
    fullName: "Fatima Zahran",
    phone: "+97433445566",
    email: null,
    contactMethod: ContactMethod.WHATSAPP,
    details: "Weekend stay in a luxury desert resort in Qatar for our anniversary, suite with private pool preferred.",
    status: TicketStatus.PREPARING_OFFER,
    adminNotes: null,
  },
];

async function main() {
  // 9 services (no admin CRUD in v1 — seed data only)
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${services.length} services.`);

  // 1 admin from env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set (see .env.example).");
  }
  const passwordHash = await hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, name: "MDN Admin" },
  });
  console.log(`Seeded admin user ${adminEmail}.`);

  // ~10 fake tickets in mixed statuses (skip if tickets already exist)
  const existingTickets = await prisma.ticket.count();
  if (existingTickets > 0) {
    console.log(`Tickets already exist (${existingTickets}) — skipping fake tickets.`);
    return;
  }

  const now = Date.now();
  for (const [index, ticket] of fakeTickets.entries()) {
    const service = await prisma.service.findUniqueOrThrow({
      where: { slug: ticket.serviceSlug },
    });
    const path = statusPath(ticket.status);
    // Spread creation over the past ~20 days, one status event every ~12h
    const createdAt = new Date(now - (fakeTickets.length - index) * 2 * 24 * 60 * 60 * 1000);

    await prisma.ticket.create({
      data: {
        referenceCode: generateReferenceCode(),
        serviceId: service.id,
        fullName: ticket.fullName,
        phone: ticket.phone,
        email: ticket.email,
        contactMethod: ticket.contactMethod,
        details: ticket.details,
        status: ticket.status,
        adminNotes: ticket.adminNotes,
        createdAt,
        statusEvents: {
          create: path.map((status, step) => ({
            status,
            createdAt: new Date(createdAt.getTime() + step * 12 * 60 * 60 * 1000),
          })),
        },
      },
    });
  }
  console.log(`Seeded ${fakeTickets.length} fake tickets.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
