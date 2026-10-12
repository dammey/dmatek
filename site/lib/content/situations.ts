// Home situation finder ("What are you trying to achieve?"). Copy verbatim
// from Dmatek Website v3.6.dc.html (const SIT). No business names appear here:
// customers describe their situation, never pick an internal unit.

export type Situation = {
  title: string;
  desc: string;
  img: string;
  alt: string;
  /** Prefills the enquiry's "closest starting point". */
  topic: string;
  /** Prefills the enquiry's environment. */
  org: string;
  overview: string;
  assess: string;
  needs: string[];
};

export const situations: Situation[] = [
  {"title":"Set up a new office","desc":"Connectivity, workplace systems, devices and ongoing support.","img":"/assets/photos/understand.jpg","alt":"An office team planning at a whiteboard","topic":"Start or move my business","org":"Business or office","overview":"A new office usually needs reliable internet with a backup line, Wi-Fi, business email and files, the right devices, and someone to call afterwards. We plan it together, set it up and document it.","assess":"Cabling routes, internet providers at the address, and how many people and rooms you need to cover.","needs":["Internet and Wi-Fi","Business email and files","Laptops and devices","Meeting room technology","Security and access","Ongoing IT support"]},
  {"title":"Open or upgrade a hotel","desc":"Guest Wi-Fi, room technology, security and integrated systems.","img":"/assets/photos/hotel.jpg","alt":"A hotel sign lit at dusk","topic":"Hospitality","org":"Hotel or hospitality","overview":"Hotels usually need guest and staff Wi-Fi, CCTV and access control, room technology, reliable power, systems hosting and backup, and support after opening. We coordinate it as one project.","assess":"Building layout, number of rooms, existing systems, opening date and power situation.","needs":["Guest and staff Wi-Fi","CCTV and access control","Room technology (key cards, IPTV)","Power and backup","Booking or guest systems","Support after opening"]},
  {"title":"Improve a school","desc":"Campus connectivity, digital systems, access and support.","img":"/assets/photos/planning.jpg","alt":"Planning a technology setup","topic":"Education","org":"School","overview":"Schools usually need campus Wi-Fi with safe internet, classroom technology, computer labs, gate and visitor records, and IT support at the start of every term.","assess":"Campus size, number of buildings and classrooms, current equipment and term dates.","needs":["Campus Wi-Fi and safe internet","Classroom technology","Computer labs and devices","Gate, CCTV and visitor records","Power","Termly IT support"]},
  {"title":"Connect or secure a property","desc":"Network coverage, surveillance, access control and connected environments.","img":"/assets/photos/cabling-site.jpg","alt":"Cabling work on an estate","topic":"Real Estate","org":"Estate or developer","overview":"Estates and buildings usually need fibre ready for internet providers, gate and perimeter security, access control, common-area power and someone looking after it all.","assess":"Site plans, number of homes or units, construction stage and existing infrastructure.","needs":["ISP-ready fibre","Gate and perimeter security","Access control and visitor codes","CCTV","Common-area power","Ongoing management"]},
  {"title":"Keep my IT running","desc":"One number to call. Problems fixed or prevented, and a plain picture every month.","img":"/assets/photos/support.jpg","alt":"A D’Matek engineer supporting a customer","topic":"Keep my IT running","org":"Business or office","overview":"Most businesses want problems fixed fast, updates and backups done without being asked, and a plain monthly summary. It usually starts with a Technology Health Check.","assess":"How many people and devices you have, your systems today and what keeps going wrong.","needs":["A Technology Health Check","Helpdesk and support","Backup and recovery","Email and account security","Device management","Not sure yet"]},
  {"title":"Equip my business","desc":"Genuine devices and equipment, set up and supported.","img":"/assets/photos/source-kit.jpg","alt":"Devices ready for set-up","topic":"Equip my business","org":"Business or office","overview":"We source genuine devices and equipment, set them up ready to use, and support them afterwards.","assess":"Quantities, specifications, delivery location and timing.","needs":["Laptops and desktops","Phones and tablets","Printers and peripherals","Networking equipment","Set-up and delivery","Repairs and replacement"]},
];

/** The pills under the tiles: Solutions deep-links, or straight to the enquiry. */
export const situationPills: { title: string; href: string }[] = [
  { title: "I need software built or integrated", href: "/solutions#ep-software" },
  { title: "Keep the power on", href: "/solutions#ep-power" },
  { title: "Secure my organisation", href: "/solutions#ep-secure" },
  { title: "Building or running an estate?", href: "/solutions/real-estate" },
  { title: "Not sure. Talk to us", href: "/contact" },
];
