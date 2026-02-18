/**
 * Script de traducción automática con Claude AI
 *
 * Uso: node scripts/translate.js
 * Requiere: ANTHROPIC_API_KEY en el entorno
 *
 * Lee resources/js/locales/es.json (fuente de verdad)
 * y genera pt-BR.json y fr.json con traducciones.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, '../resources/js/locales');

const client = new Anthropic();

const source = JSON.parse(readFileSync(join(localesDir, 'es.json'), 'utf8'));

async function translateTo(targetLanguage, langCode) {
    console.log(`\nTraduciendo a ${targetLanguage} (${langCode})...`);

    const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [
            {
                role: 'user',
                content: `Eres un traductor experto para una web de invitación de boda elegante.
Traduce el siguiente objeto JSON del español a ${targetLanguage}.

Reglas:
- Mantén exactamente las mismas claves JSON
- Preserva los placeholders {{name}} y {{count}} tal cual
- Preserva los emojis tal cual
- Adapta el tono: íntimo, cálido, festivo (invitación de boda)
- Devuelve ÚNICAMENTE el objeto JSON, sin explicaciones ni bloques de código

JSON a traducir:
${JSON.stringify(source, null, 2)}`,
            },
        ],
    });

    const text = response.content[0].text.trim();
    // Strip markdown code blocks if present
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const translated = JSON.parse(json);

    const outputPath = join(localesDir, `${langCode}.json`);
    writeFileSync(outputPath, JSON.stringify(translated, null, 2) + '\n');
    console.log(`✓ ${langCode}.json generado en ${outputPath}`);
}

console.log('🌍 Iniciando traducciones automáticas...');
console.log(`📖 Fuente: ${join(localesDir, 'es.json')}\n`);

await translateTo('Português do Brasil (pt-BR)', 'pt-BR');
await translateTo('Français', 'fr');

console.log('\n✅ Traducciones completadas. Recuerda revisar el resultado antes de hacer deploy.');
