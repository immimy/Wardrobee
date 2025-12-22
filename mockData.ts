const productImages = [
  {
    name: 'urban-drift',
    extension: 'webp',
  },
  {
    name: 'soft-horizon',
    extension: 'webp',
  },
  {
    name: 'everyday-form',
    extension: 'jpeg',
  },
  {
    name: 'modern-loom',
    extension: 'webp',
  },
  {
    name: 'quiet-motion',
    extension: 'jpeg',
  },
  {
    name: 'natural-balance',
    extension: 'jpeg',
  },
  {
    name: 'refined-path',
    extension: 'webp',
  },
  {
    name: 'essential-layer',
    extension: 'webp',
  },
  {
    name: 'timeless-edge',
    extension: 'jpeg',
  },
];
const products = {
  name: [
    'Urban Drift',
    'Soft Horizon',
    'Everyday Form',
    'Modern Loom',
    'Quiet Motion',
    'Natural Balance',
    'Refined Path',
    'Essential Layer',
    'Timeless Edge',
  ],
  description: [
    'Urban Drift is designed for modern movement, blending clean structure with everyday practicality. Its form reflects a balance between durability and visual simplicity, allowing it to integrate effortlessly into daily routines. Carefully selected materials provide a comfortable feel while maintaining a refined presence that does not overpower your overall look.\nThe thoughtful construction supports frequent use, offering stability and flexibility without unnecessary weight. Every detail is considered to enhance usability, from the way it rests during wear to how it adapts to different environments. The design encourages ease of motion while retaining a confident and composed silhouette.\nIdeal for those who value understated style, Urban Drift complements a wide range of outfits and lifestyles. Whether used during busy weekdays or relaxed moments, it delivers consistency, comfort, and lasting appeal. Its quiet confidence makes it a dependable choice for those who appreciate timeless design with modern sensibility.',
    'Soft Horizon emphasizes comfort through gentle structure and balanced proportions. Its design focuses on creating a smooth visual flow while offering a tactile experience that feels natural and reassuring. The materials are chosen to age gracefully, maintaining their look and feel even with frequent use.\nBuilt with adaptability in mind, this piece transitions seamlessly between different settings. It supports daily activities without feeling restrictive, providing a sense of ease throughout long hours of wear. Subtle detailing adds depth without drawing attention away from the overall form.\nSoft Horizon is suited for individuals who prefer calm, versatile design. It enhances personal style quietly, allowing it to blend into both minimal and expressive wardrobes. Reliable and refined, it becomes a trusted companion that supports everyday life with comfort and confidence.',
    'Everyday Form is created to meet the demands of daily life while maintaining a polished appearance. Its structure is carefully balanced to feel secure yet flexible, ensuring comfort during extended use. The design prioritizes clarity and function, avoiding excess while focusing on what truly matters.\nEach element works together to provide stability and ease of movement. The materials offer durability without sacrificing softness, making it suitable for a wide range of routines and environments. Thoughtful craftsmanship ensures it retains its shape and reliability over time.\nDesigned for versatility, Everyday Form fits naturally into different lifestyles. It supports your routine without demanding attention, offering consistent performance and understated style. This piece is ideal for those who value practicality, longevity, and clean design in their everyday essentials.',
    'Modern Loom reflects contemporary design through refined structure and purposeful simplicity. It combines clean lines with subtle texture, creating a balanced aesthetic that feels current yet enduring. The materials are selected for their ability to provide both comfort and long-term performance.\nIts construction allows for natural movement while maintaining a composed appearance. Each detail is intentional, supporting ease of use and visual harmony. The design adapts well to changing environments, making it suitable for both structured and relaxed settings.\nModern Loom is designed for individuals who appreciate thoughtful craftsmanship and modern style. It integrates seamlessly into daily routines, offering reliability and elegance without excess. This piece stands as a quiet expression of confidence, practicality, and contemporary living.',
    'Quiet Motion focuses on effortless usability and refined form. Designed to move naturally with you, it offers a sense of balance that supports comfort throughout the day. The structure feels light yet dependable, providing reassurance without feeling restrictive.\nAttention to detail ensures that each component contributes to overall ease. The materials respond well to regular use, maintaining their integrity while offering a pleasant tactile experience. Its form encourages fluid movement and adaptability in different situations.\nQuiet Motion is ideal for those who value subtle design and consistent performance. It enhances daily routines without distraction, offering a calm presence that complements modern lifestyles. This piece delivers lasting comfort, understated style, and dependable functionality.',
    'Natural Balance is inspired by harmony between form and function. Its design emphasizes proportion and material quality, resulting in a piece that feels intuitive to use and visually grounded. The structure supports everyday needs while remaining comfortable and approachable.\nBuilt for reliability, it maintains its shape and performance over time. The materials are chosen to provide durability alongside a soft, natural feel. Each detail is refined to support ease of use without unnecessary complexity.\nNatural Balance suits those who appreciate simplicity with purpose. It blends seamlessly into daily life, offering versatility and calm confidence. Designed to endure changing trends, it remains a dependable choice for individuals who value thoughtful, balanced design.',
    'Refined Path delivers a composed and intentional design focused on clarity and durability. Its structure is shaped to support daily activity while maintaining a refined appearance. Carefully crafted materials ensure comfort and resilience, making it suitable for frequent use.\nThe construction emphasizes balance, allowing it to adapt naturally to different situations. Subtle detailing enhances the overall form without overpowering it. The result is a piece that feels both reliable and thoughtfully designed.\nRefined Path is ideal for those who seek elegance through restraint. It complements a wide range of personal styles while offering consistent performance. This design stands as a quiet statement of quality, confidence, and timeless appeal.',
    'Essential Layer is designed to support everyday routines with dependable comfort and versatility. Its clean construction allows it to integrate easily into various settings, offering a practical yet refined presence. The materials provide a balanced feel that supports long-term use.\nEach aspect of the design focuses on usability and consistency. The structure adapts to movement while maintaining stability, ensuring comfort throughout the day. Attention to craftsmanship ensures durability without unnecessary weight.\nEssential Layer becomes a reliable part of daily life, offering subtle enhancement rather than distraction. It is ideal for those who value functional design with lasting relevance. Simple, adaptable, and dependable, it supports your understanding of everyday essentials.',
    'Timeless Edge is defined by durability, clarity, and lasting style. Its design avoids trends in favor of balanced proportions and reliable materials. The result is a piece that feels grounded and confident, suitable for repeated use.\nThe structure supports daily movement while maintaining its form. Materials are selected to provide comfort and strength, ensuring consistent performance over time. Each detail contributes to a cohesive and refined whole.\nTimeless Edge is made for individuals who value longevity and understated sophistication. It enhances your routine quietly, offering stability and confidence. Designed to remain relevant across seasons, it delivers dependable quality with enduring appeal.',
  ],
};

const addresses = {
  receiver: [
    'Andrew Collins',
    'Penelope Wright',
    'Oliver Bennett',
    'Peony Harris',
    'Daniel Thompson',
    'Sophia Mitchell',
    'Lucas Reynolds',
    'Amelia Foster',
    'Ethan Parker',
    'Charlotte Green',
  ],
  address: [
    '88/12 Sukhumvit Road, Khlong Toei, Bangkok 10110, Thailand',
    '120/5 Moo 4, Chaeng Watthana Road, Pak Kret, Nonthaburi 11120, Thailand',
    '45/89 Rama IX Road, Huai Khwang, Bangkok 10310, Thailand',
    '77/3 Moo 6, Mittraphap Road, Mueang, Nakhon Ratchasima 30000, Thailand',
    '19/44 Nimmanhaemin Road, Suthep, Chiang Mai 50200, Thailand',
    '301/12 Moo 2, Srisoonthorn Road, Thalang, Phuket 83110, Thailand',
    '56/7 Moo 9, Bang Na-Trat Road, Bang Phli, Samut Prakan 10540, Thailand',
    '144/22 Phetkasem Road, Nong Khaem, Bangkok 10160, Thailand',
    '9/81 Moo 1, Beach Road, Sattahip, Chonburi 20180, Thailand',
    '210/6 Moo 5, Chiang Mai–Lampun Road, Saraphi, Chiang Mai 50140, Thailand',
  ],
  phoneNumber: [
    '080-000-XXX',
    '081-415-XXX',
    '082-000-XXX',
    '083-415-XXX',
    '084-000-XXX',
    '085-415-XXX',
    '086-000-XXX',
    '087-415-XXX',
    '088-000-XXX',
    '089-415-XXX',
  ],
};

export default { productImages, products, addresses };
