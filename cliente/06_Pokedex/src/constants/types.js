export const pokemonTypes = [
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy"
];

export const TYPE_TRANSLATIONS = {
  Normal: "Normal",
  Fire: "Fuego",
  Water: "Agua",
  Grass: "Planta",
  Electric: "Eléctrico",
  Ice: "Hielo",
  Fighting: "Lucha",
  Poison: "Veneno",
  Ground: "Tierra",
  Flying: "Volador",
  Psychic: "Psíquico",
  Bug: "Bicho",
  Rock: "Roca",
  Ghost: "Fantasma",
  Dragon: "Dragón",
  Dark: "Siniestro",
  Steel: "Acero",
  Fairy: "Hada"
};

export const HABITAT_TRANSLATIONS = {
  Grassland: "Pradera",
  Mountain: "Montaña",
  "Waters Edge": "Orilla del agua",
  Forest: "Bosque",
  Cave: "Caverna",
  Sea: "Mar",
  Legendary: "Legendario"
};

export const ABILITY_TRANSLATIONS = {
  Overgrow: "Espesura",
  Chlorophyll: "Clorofila",
  Blaze: "Mar Llamas",
  "Solar Power": "Poder Solar",
  Torrent: "Torrente",
  "Rain Dish": "Cura Lluvia",
  "Shed Skin": "Mudar",
  "Keen Eye": "Vista Lince",
  "Tangled Feet": "Tumbos",
  "Big Pecks": "Sacapecho",
  "Run Away": "Fuga",
  Hustle: "Entusiasmo",
  "Early Bird": "Madrugar",
  Static: "Elec. Estática",
  "Lightning Rod": "Pararrayos",
  Levitate: "Levitación",
  Sniper: "Francotirador",
  "Rock Head": "Cabeza Roca",
  Sturdy: "Robustez",
  "Sheer Force": "Potencia Bruta",
  "Shield Dust": "Polvo Escudo",
  "Compound Eyes": "Ojo Compuesto",
  "Tinted Lens": "Cromolente",
  Stench: "Hedor",
  Intimidate: "Intimidación",
  Aftermath: "Resquicio",
  "Swift Swim": "Nado Rápido",
  Swarm: "Enjambre",
  Unnerve: "Nerviosismo",
  Steadfast: "Impasible",
  Moxie: "Autoestima",
  "Sand Force": "Poder Arena",
  "Battle Armor": "Armadura Batalla",
  "Inner Focus": "Foco Interno",
  "Water Absorb": "Absorbe Agua",
  Hydration: "Hidratación",
  "Magma Armor": "Escudo Magma",
  "Flame Body": "Cuerpo Llama",
  Pickup: "Recogida",
  "Quick Feet": "Pies Rápidos",
  "Shell Armor": "Caparazón",
  Pressure: "Presión",
  None: "Ninguna",
  Synchronize: "Sincronía",
  "Leaf Guard": "Defensa Hoja",
  Infiltrator: "Allanamiento",
  "Natural Cure": "Cura Natural",
  "Hyper Cutter": "Corte Fuerte",
  "Arena Trap": "Trampa Arena",
  "Clear Body": "Cuerpo Puro",
  Illuminate: "Iluminación",
  "Poison Point": "Punto Tóxico",
  "Cursed Body": "Cuerpo Maldito"
};

export function translateType(type) {
  if (!type) return "";
  return TYPE_TRANSLATIONS[type] || type;
}

export function translateHabitat(habitat) {
  if (!habitat) return "";
  return HABITAT_TRANSLATIONS[habitat] || habitat;
}

export function translateAbility(ability) {
  if (!ability) return "";
  return ABILITY_TRANSLATIONS[ability] || ability;
}
