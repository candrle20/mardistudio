import { buildTemplatePrompt } from './lib/prompts/template-guides';

const output = buildTemplatePrompt({
  basePrompt: 'Create an elegant wedding bar sign with signature cocktails list and welcome message',
  templateType: 'sign',
  templateName: 'Bar Sign',
  width: 2100,
  height: 1500,
});
console.log('length', output.prompt.length);
console.log(output.prompt);
