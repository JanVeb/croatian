export interface MenuItem {
  id: number;
  category: 'Appetizer' | 'Main' | 'Dessert' | 'Drink';
  name_hr: string;
  name_en: string;
  name_zh: string;
  description_hr: string;
  description_en: string;
  description_zh: string;
  price: number;
  image: string;
  spicy_level: number;
  is_vegetarian: boolean;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchAndParseMenu(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}menu.csv`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu.csv: ${response.statusText}`);
    }
    const csvText = await response.text();
    // Split lines and handle carriage returns
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    // Skip header row
    const headers = parseCSVLine(lines[0]);
    const items: MenuItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length < headers.length) continue; // Skip malformed lines

      const item: MenuItem = {
        id: parseInt(values[0], 10),
        category: values[1] as MenuItem['category'],
        name_hr: values[2],
        name_en: values[3],
        name_zh: values[4],
        description_hr: values[5],
        description_en: values[6],
        description_zh: values[7],
        price: parseFloat(values[8]),
        image: values[9],
        spicy_level: parseInt(values[10], 10),
        is_vegetarian: values[11].toLowerCase() === 'true'
      };
      items.push(item);
    }
    return items;
  } catch (error) {
    console.error('Error loading or parsing menu:', error);
    return [];
  }
}
