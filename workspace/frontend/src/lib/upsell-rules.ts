export interface UpsellRule {
  matchKeywords: string[];
  suggestion: {
    name: string;
    description: string;
    priceAdjustment: number;
  };
  matchMode: 'any' | 'all';
  priority: number;
}

export const upsellRules: UpsellRule[] = [
  // ── Coffee & Espresso ──
  { matchKeywords: ['americano', 'latte', 'cappuccino', 'espresso', 'mocha', 'flat white', 'macchiato', 'affogato'], suggestion: { name: 'Croissant', description: 'Croissant +Rp15.000', priceAdjustment: 15000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['iced coffee', 'cold brew', 'frappe', 'frappuccino', 'es kopi susu', 'iced latte'], suggestion: { name: 'Upgrade Large', description: 'Upgrade Large +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['kopi', 'coffee'], suggestion: { name: 'Pisang Goreng', description: 'Pisang Goreng +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 3 },

  // ── Milk & Chocolate ──
  { matchKeywords: ['chocolate', 'coklat', 'milo', 'hot chocolate', 'white chocolate'], suggestion: { name: 'Marshmallow', description: 'Add Marshmallow +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['milkshake', 'smoothie', 'milk', 'susu'], suggestion: { name: 'Upgrade Large', description: 'Upgrade Large +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },

  // ── Tea & Infusions ──
  { matchKeywords: ['tea', 'teh', 'thai tea', 'matcha', 'green tea', 'chai', 'earl grey', 'jasmine'], suggestion: { name: 'Boba Pearl', description: 'Add Boba Pearl +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['teh tarik', 'teh susu', 'milk tea', 'bubble tea'], suggestion: { name: 'Extra Topping', description: 'Extra Topping +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 2 },

  // ── Juice & Lemonade ──
  { matchKeywords: ['juice', 'jus', 'lemonade', 'orange juice', 'avocado', 'alpukat'], suggestion: { name: 'Ice Cream Scoop', description: 'Add Ice Cream Scoop +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['soda', 'soft drink', 'cola', 'sprite', 'fanta'], suggestion: { name: 'Upgrade Large', description: 'Upgrade Large +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 1 },

  // ── Rice & Noodles ──
  { matchKeywords: ['nasi goreng', 'fried rice', 'nasi', 'rice'], suggestion: { name: 'Extra Topping', description: 'Extra Topping +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['nasi goreng', 'fried rice'], suggestion: { name: 'Telur Ceplok', description: 'Add Fried Egg +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['mie goreng', 'mie', 'noodle', 'ramen', 'udon', 'pasta', 'spaghetti'], suggestion: { name: 'Extra Topping', description: 'Extra Topping +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['mie goreng', 'mie', 'noodle', 'ramen'], suggestion: { name: 'Telur Rebus', description: 'Add Boiled Egg +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['kwetiau', 'bihun', 'kwe tiaw', 'ho fun'], suggestion: { name: 'Extra Porsi', description: 'Extra Portion +Rp7.000', priceAdjustment: 7000 }, matchMode: 'any', priority: 1 },

  // ── Indonesian Food ──
  { matchKeywords: ['sate', 'satay'], suggestion: { name: 'Lontong', description: 'Add Lontong +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['sate', 'satay'], suggestion: { name: 'Extra Saus Kacang', description: 'Extra Peanut Sauce +Rp3.000', priceAdjustment: 3000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['gado gado', 'gado-gado', 'ketoprak', 'karedok'], suggestion: { name: 'Extra Tahu', description: 'Add Extra Tahu +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['gado gado', 'gado-gado', 'ketoprak'], suggestion: { name: 'Extra Telur', description: 'Add Boiled Egg +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['bakso', 'meatball'], suggestion: { name: 'Extra Bakso', description: 'Extra Meatball +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['bakso', 'meatball'], suggestion: { name: 'Extra Mie', description: 'Add Noodles +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['soto', 'sop', 'sup'], suggestion: { name: 'Nasi Putih', description: 'Add Rice +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['rendang', 'gulai', 'kari', 'curry'], suggestion: { name: 'Nasi Putih', description: 'Add Rice +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['ayam goreng', 'fried chicken', 'ayam bakar', 'grilled chicken'], suggestion: { name: 'Sambal Ekstra', description: 'Extra Sambal +Rp3.000', priceAdjustment: 3000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['ayam goreng', 'fried chicken', 'ayam penyet'], suggestion: { name: 'Nasi Putih', description: 'Add Rice +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['tahu', 'tempe'], suggestion: { name: 'Sambal Kecap', description: 'Sweet Soy Sauce +Rp2.000', priceAdjustment: 2000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['martabak'], suggestion: { name: 'Keju Ganda', description: 'Extra Cheese +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['martabak'], suggestion: { name: 'Coklat Ekstra', description: 'Extra Chocolate +Rp6.000', priceAdjustment: 6000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['pempek', 'empek'], suggestion: { name: 'Ekstra Kuah Cuko', description: 'Extra Cuko Sauce +Rp2.000', priceAdjustment: 2000 }, matchMode: 'any', priority: 1 },

  // ── Western Food ──
  { matchKeywords: ['burger', 'beef burger', 'chicken burger'], suggestion: { name: 'Extra Patty', description: 'Extra Patty +Rp12.000', priceAdjustment: 12000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['burger', 'beef burger', 'chicken burger'], suggestion: { name: 'French Fries', description: 'Add French Fries +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['pizza'], suggestion: { name: 'Extra Cheese', description: 'Extra Cheese +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['pizza'], suggestion: { name: 'Stuffed Crust', description: 'Stuffed Crust +Rp15.000', priceAdjustment: 15000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['pasta', 'spaghetti', 'fettuccine', 'lasagna', 'penne'], suggestion: { name: 'Extra Cheese', description: 'Extra Cheese +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['pasta', 'spaghetti', 'fettuccine'], suggestion: { name: 'Garlic Bread', description: 'Add Garlic Bread +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['salad', 'caesar'], suggestion: { name: 'Extra Protein', description: 'Add Chicken +Rp12.000', priceAdjustment: 12000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['sandwich', 'wrap', 'sub'], suggestion: { name: 'Extra Filling', description: 'Extra Filling +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['sandwich', 'wrap', 'sub'], suggestion: { name: 'Side Salad', description: 'Add Side Salad +Rp6.000', priceAdjustment: 6000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['soup', 'cream soup', 'tomato soup', 'mushroom soup'], suggestion: { name: 'Garlic Bread', description: 'Add Garlic Bread +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['steak', 'ribeye', 'sirloin', 'tenderloin'], suggestion: { name: 'Mashed Potato', description: 'Add Mashed Potato +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['steak', 'ribeye', 'sirloin'], suggestion: { name: 'Extra Sauce', description: 'Extra Sauce +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['fish and chip', 'fish & chip'], suggestion: { name: 'Extra Tartar', description: 'Extra Tartar Sauce +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['taco', 'burrito', 'quesadilla', 'nachos'], suggestion: { name: 'Guacamole', description: 'Add Guacamole +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },

  // ── Snacks & Appetizers ──
  { matchKeywords: ['french fries', 'fries', 'kentang', 'potato'], suggestion: { name: 'Upgrade Loaded', description: 'Upgrade to Loaded Fries +Rp12.000', priceAdjustment: 12000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['chicken wings', 'wings', 'sayap'], suggestion: { name: 'Extra Sauce', description: 'Extra Dipping Sauce +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['chicken wings', 'wings', 'sayap'], suggestion: { name: 'Large Portion', description: 'Large Portion +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['spring roll', 'lumpia', 'samosa', 'dim sum'], suggestion: { name: 'Dipping Sauce', description: 'Add Dipping Sauce +Rp3.000', priceAdjustment: 3000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['onion ring', 'calamari'], suggestion: { name: 'Extra Sauce', description: 'Extra Sauce +Rp3.000', priceAdjustment: 3000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['nachos'], suggestion: { name: 'Extra Cheese', description: 'Extra Cheese Sauce +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },

  // ── Breakfast ──
  { matchKeywords: ['pancake', 'pancakes'], suggestion: { name: 'Extra Syrup', description: 'Extra Maple Syrup +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['pancake', 'pancakes', 'waffle'], suggestion: { name: 'Whipped Cream', description: 'Add Whipped Cream +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['omelette', 'omen', 'scrambled egg'], suggestion: { name: 'Extra Filling', description: 'Extra Filling +Rp7.000', priceAdjustment: 7000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['toast', 'roti bakar', 'french toast'], suggestion: { name: 'Extra Butter', description: 'Extra Butter +Rp3.000', priceAdjustment: 3000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['cereal', 'granola', 'oatmeal'], suggestion: { name: 'Fresh Fruit', description: 'Add Fresh Fruit +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },

  // ── Desserts ──
  { matchKeywords: ['ice cream', 'es krim', 'gelato'], suggestion: { name: 'Double Scoop', description: 'Upgrade Double Scoop +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['cake', 'cheesecake', 'brownie', 'tiramisu'], suggestion: { name: 'Ice Cream', description: 'Add Ice Cream Scoop +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['pudding', 'puding', 'flan'], suggestion: { name: 'Whipped Cream', description: 'Add Whipped Cream +Rp4.000', priceAdjustment: 4000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['pie', 'apple pie', 'pecan pie'], suggestion: { name: 'Ice Cream', description: 'Add Ice Cream Scoop +Rp10.000', priceAdjustment: 10000 }, matchMode: 'any', priority: 1 },

  // ── Asian Specials ──
  { matchKeywords: ['sushi', 'sashimi', 'maki', 'nigiri', 'roll'], suggestion: { name: 'Edamame', description: 'Add Edamame +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['sushi', 'sashimi', 'maki'], suggestion: { name: 'Miso Soup', description: 'Add Miso Soup +Rp6.000', priceAdjustment: 6000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['dim sum', 'siomay', 'hakau', 'xiao long bao'], suggestion: { name: 'Extra Sauce', description: 'Extra Chili Sauce +Rp3.000', priceAdjustment: 3000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['pad thai', 'tom yum', 'green curry', 'pho'], suggestion: { name: 'Extra Topping', description: 'Extra Topping +Rp8.000', priceAdjustment: 8000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['korean', 'bulgogi', 'bibimbap', 'kimchi'], suggestion: { name: 'Extra Kimchi', description: 'Extra Kimchi +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['korean', 'bulgogi', 'bibimbap'], suggestion: { name: 'Fried Egg', description: 'Add Fried Egg +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['ramen'], suggestion: { name: 'Extra Chashu', description: 'Extra Pork Belly +Rp15.000', priceAdjustment: 15000 }, matchMode: 'any', priority: 1 },
  { matchKeywords: ['ramen'], suggestion: { name: 'Ajitsuke Tamago', description: 'Add Seasoned Egg +Rp5.000', priceAdjustment: 5000 }, matchMode: 'any', priority: 2 },
  { matchKeywords: ['curry', 'kari', 'gulai'], suggestion: { name: 'Roti Canai', description: 'Add Roti Canai +Rp7.000', priceAdjustment: 7000 }, matchMode: 'any', priority: 2 },
];

export function findUpsell(itemName: string): UpsellRule | null {
  const name = itemName.toLowerCase();
  let best: UpsellRule | null = null;
  for (const rule of upsellRules) {
    const matches = rule.matchKeywords.filter(kw => name.includes(kw.toLowerCase()));
    const matched = rule.matchMode === 'all'
      ? matches.length === rule.matchKeywords.length
      : matches.length > 0;
    if (matched) {
      if (!best || rule.priority < best.priority) {
        best = rule;
      }
    }
  }
  return best;
}
