import { exec } from 'child_process';
import path from 'path';

let handler = async (m, { conn }) => {
  const botPath = path.resolve('./'); // Carpeta donde está tu bot
  await conn.sendMessage(m.chat, '🔄 Actualizando el bot...', { quoted: m });

  exec('git pull', { cwd: botPath }, (err, stdout, stderr) => {
    if (err) {
      conn.sendMessage(
        m.chat,
        `❌ Error: No se pudo actualizar el bot.\nRazón: ${err.message}`,
        { quoted: m }
      );
      return;
    }

    if (stderr) console.warn('Advertencia durante la actualización:', stderr);

    const output = stdout.length > 1000 ? stdout.slice(0, 1000) + '...\n[Salida truncada]' : stdout;

    if (stdout.includes('Already up to date.')) {
      conn.sendMessage(m.chat, '✅ El bot ya está actualizado.', { quoted: m });
    } else {
      conn.sendMessage(m.chat, `✅ Actualización realizada con éxito.\n\n${output}`, { quoted: m });
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update'];
handler.rowner = true;

export default handler;