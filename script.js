const morseCode = Object.freeze({
  ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E",
  "..-.": "F", "--.": "G", "....": "H", "..": "I", ".---": "J",
  "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O",
  ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
  "..-": "U", "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y",
  "--..": "Z",
  "-----": "0", ".----": "1", "..---": "2", "...--": "3",
  "....-": "4", ".....": "5", "-....": "6", "--...": "7",
  "---..": "8", "----.": "9",
  "/": " "
});

// Palavra correta para o anagrama (mude conforme o puzzle)
const senhaCorreta = "SOCORRO";
let resultadoAnagrama = "";
let tentativasSenha = 0;
let risco = 0; // 0 a 100

const operadorNome = "Gabriel Lima";
const mensagensGabriel = [
  "Aqui é Gabriel Lima, radialista de Ouro Virgem... Se alguém estiver ouvindo, por favor, responda. <span class='interferencia'>[Estática]</span>",
  "O culto de Virgo está cada vez mais ousado. Preciso de ajuda, minha filha Carol corre perigo. <span class='interferencia'>[Ruído]</span>",
  "Eles sequestraram outras crianças. Não deixem levarem a Carol. <span class='interferencia'>[Sinal fraco]</span>",
  "Se conseguirem decifrar, avisem as autoridades. Não posso confiar em ninguém aqui. <span class='interferencia'>[Estática]</span>",
  "O sinal pode ser rastreado. Se sumir, procurem por Carol. <span class='interferencia'>[Interferência]</span>"
];
const respostasOperador = [
  "Por favor, alguém está ouvindo? Eles estão cada vez mais perto...",
  "Preciso de ajuda, minha filha Carol corre perigo.",
  "O culto de Virgo está me vigiando. Não tenho muito tempo.",
  "Se alguém receber isso, proteja as crianças de Ouro Virgem.",
  "Eles já levaram outras crianças. Não deixem levarem a Carol.",
  "Se conseguirem decifrar, avisem as autoridades. Não posso confiar em ninguém aqui.",
  "O sinal pode ser rastreado. Se sumir, procurem por Carol."
];
const respostasCulto = [
  "VOCÊS NÃO DEVERIAM OUVIR ISSO.",
  "O OLHO DE VIRGO TUDO VÊ.",
  "A VERDADE NÃO PODE SER ESCONDIDA.",
  "O SACRIFÍCIO SE APROXIMA.",
  "CAROL É NOSSA."
];

const $ = (id) => document.getElementById(id);

function playStatic() {
  const audio = $("static-audio");
  audio.currentTime = 0;
  audio.volume = 0.18;
  audio.play();
}
function playCulto() {
  const audio = $("cult-audio");
  audio.currentTime = 0;
  audio.volume = 0.22;
  audio.play();
}

function logMensagem(texto, tipo = "info") {
  const log = $("log");
  const timestamp = new Date().toLocaleTimeString();
  const prefix = tipo === "erro" ? "[ERRO]" : ">";
  log.textContent += `[${timestamp}] ${prefix} ${texto}\n`;
  log.scrollTop = log.scrollHeight;
}

function limparCampos() {
  $("entrada").value = "";
  $("saida").innerText = "";
  $("saida").classList.remove("terminal-cursor");
  $("log").innerText = "";
  $("dica").innerText = "DICA: 1 = ponto (.), 0 = traço (-), _ = espaço entre letras.";
  $("copiar").classList.remove("mostrar");
  $("copiar").style.display = "none";
  $("operador-resposta").innerText = "";
  $("progress-bar").hidden = true;
  $("alerta").hidden = true;
  $("barra-risco").hidden = true;
  $("senha-camada").hidden = true;
  $("risco").style.width = "0%";
  tentativasSenha = 0;
  risco = 0;
  $("entrada").focus();
  msgInicialGabriel();
}

function setLoading(ativo) {
  $("loading").hidden = !ativo;
  if (ativo) playStatic();
}

function mostrarDicaExtra(resultado) {
  if (resultado.includes("?")) {
    $("dica").innerText = "DICA: Verifique se digitou corretamente. Cada letra deve ser separada por um _ (underline).";
  } else {
    $("dica").innerText = "DICA: Mensagem decodificada! Compartilhe com o grupo e ajude Gabriel e Carol.";
  }
}

function easterEgg(resultado) {
  const palavra = resultado.replace(/[^A-Z]/gi, "").toUpperCase();
  if (palavra === "HELP" || palavra === "SOS" || palavra.includes("SOCORRO")) {
    setTimeout(() => {
      alert("⚠️ Mensagem de socorro detectada! Gabriel está pedindo ajuda!");
    }, 300);
  }
  if (palavra.includes("CAROL")) {
    setTimeout(() => {
      alert("⚠️ Nome de Carol detectado! Ela pode estar em perigo. Não ignore este pedido.");
    }, 400);
  }
  if (palavra.includes("VIRGO")) {
    setTimeout(() => {
      alert("⚠️ O culto de Virgo está envolvido. Cuidado com rastreamento!");
    }, 500);
  }
  if (palavra.includes("OURO")) {
    setTimeout(() => {
      alert("⚠️ Ouro Virgem: a cidade está em alerta. Investigue imediatamente!");
    }, 600);
  }
  if (palavra.includes("GABRIEL")) {
    setTimeout(() => {
      alert("⚠️ Gabriel Lima: radialista em perigo. Ele precisa de ajuda urgente!");
    }, 700);
  }
}

function barraProgresso(callback) {
  $("progress-bar").hidden = false;
  $("progress").style.width = "0%";
  let progresso = 0;
  const intervalo = setInterval(() => {
    progresso += Math.random() * 20 + 10;
    if (progresso >= 100) {
      $("progress").style.width = "100%";
      clearInterval(intervalo);
      setTimeout(callback, 400);
    } else {
      $("progress").style.width = `${Math.min(progresso, 100)}%`;
    }
  }, 200);
}

function animarResultado(texto, callback) {
  $("saida").innerText = "";
  $("saida").classList.add("terminal-cursor");
  let i = 0;
  function escrever() {
    if (i < texto.length) {
      $("saida").innerText += texto[i];
      i++;
      setTimeout(escrever, 40 + Math.random() * 40);
    } else {
      $("saida").classList.remove("terminal-cursor");
      if (callback) callback();
    }
  }
  escrever();
}

function respostaOperador(resultado) {
  let idx = 0;
  if (risco >= 66) idx = 4;
  else if (risco >= 33) idx = 1;
  else idx = Math.floor(Math.random() * respostasOperador.length);

  if (resultado && !resultado.includes("?")) {
    $("operador-resposta").innerHTML = `<span class="interferencia">[Gabriel]: Obrigado! Vocês são minha última esperança.</span>`;
  } else {
    $("operador-resposta").innerHTML = `<span class="interferencia">[Gabriel]: ${respostasOperador[idx]}</span>`;
  }
}

function respostaCulto() {
  const idx = Math.floor(Math.random() * respostasCulto.length);
  $("operador-resposta").innerHTML = `<span class="interferencia" style="color:#ff2222;">[Culto de Virgo]: ${respostasCulto[idx]}</span>`;
  playCulto();
}

function atualizarBarraRisco() {
  $("barra-risco").hidden = false;
  $("risco").style.width = `${risco}%`;
  if (risco >= 100) {
    $("saida").innerText = "[O culto de Virgo interceptou sua transmissão! Aguarde para tentar novamente...]";
    respostaCulto();
    $("processar").disabled = true;
    $("senha").value = "";
    $("senha-camada").hidden = true;
    setTimeout(() => {
      risco = 0;
      $("barra-risco").hidden = true;
      $("processar").disabled = false;
      $("saida").innerText = "";
      $("operador-resposta").innerText = "";
      msgInicialGabriel();
    }, 30000);
  }
}

function embaralhar(str) {
  return str.split('').sort(() => Math.random() - 0.5).join('');
}

function mostrarCamadaSenha(anagrama) {
  $("senha-camada").hidden = false;
  $("senha").value = "";
  $("senha-feedback").textContent = "";
  setTimeout(() => $("senha").focus(), 100);
  resultadoAnagrama = anagrama;
  tentativasSenha = 0;
  $("saida").innerText = `[Mensagem Decodificada]: ${anagrama}\n\nDigite a senha correta para liberar a mensagem!`;
  $("copiar").classList.remove("mostrar");
  $("copiar").style.display = "none";
}

function esconderCamadaSenha() {
  $("senha-camada").hidden = true;
  $("senha-feedback").textContent = "";
}

function verificarSenha() {
  const tentativa = $("senha").value.trim().toUpperCase();
  tentativasSenha++;
  if (tentativa === senhaCorreta) {
    $("senha-feedback").textContent = "Senha correta!";
    $("senha-feedback").className = "senha-feedback sucesso";
    setTimeout(() => {
      esconderCamadaSenha();
      $("saida").innerText = `[Mensagem Final de Gabriel]:\n\n"Se você conseguiu decifrar isto, por favor, escute com atenção. Eles estão em toda parte. O culto de Virgo já levou outras crianças e agora vigiam cada passo meu. Não sei quanto tempo me resta. Minha filha Carol é o próximo alvo. Não confie em ninguém de Ouro Virgem. Se puder ajudar, faça rápido... antes que o silêncio da rádio seja tudo o que reste de mim."`;
      $("operador-resposta").innerHTML = `<span class="interferencia">[Gabriel]: Obrigado! Vocês são minha última esperança.</span>`;
      $("copiar").classList.add("mostrar");
      $("copiar").style.display = "inline-block";
    }, 1200);
    risco = 0;
    atualizarBarraRisco();
  } else {
    $("senha-feedback").textContent = "Senha incorreta!";
    $("senha-feedback").className = "senha-feedback erro";
    setTimeout(() => $("senha").focus(), 100);
    if (tentativasSenha === 2) {
      $("senha-feedback").textContent += " Dica: É um pedido de socorro.";
    }
    risco += 20;
    atualizarBarraRisco();
  }
}

function corrigirEDecodificar() {
  if (risco >= 100) {
    $("saida").innerText = "[Terminal bloqueado temporariamente]";
    respostaCulto();
    $("alerta").hidden = false;
    $("senha-camada").hidden = true;
    logMensagem("Terminal bloqueado! O culto de Virgo pode estar rastreando a transmissão...", "erro");
    $("dica").innerText = "DICA: Aguarde 30 segundos para tentar novamente. Mantenha-se oculto!";
    return;
  }

  const btn = $("processar");
  btn.disabled = true;
  setLoading(true);
  $("saida").innerText = "";
  $("saida").classList.remove("terminal-cursor");
  $("log").innerText = "";
  $("copiar").classList.remove("mostrar");
  $("copiar").style.display = "none";
  $("operador-resposta").innerText = "";
  $("progress-bar").hidden = false;
  $("progress").style.width = "0%";

  if (risco > 0) $("alerta").hidden = false;

  logMensagem("Interceptando transmissão de Gabriel Lima...");
  let entrada = $("entrada").value.trim();

  entrada = entrada.replace(/[^01_]/g, "");
  if (!entrada.match(/[01_]/)) {
    setTimeout(() => {
      logMensagem("Falha: Nenhum símbolo válido detectado (0, 1, _).", "erro");
      $("saida").innerText = "[Erro]: Entrada inválida.";
      $("dica").innerText = "DICA: Use apenas 0, 1 e _ conforme instruções.";
      btn.disabled = false;
      setLoading(false);
      $("progress-bar").hidden = true;
      risco += 33;
      atualizarBarraRisco();
      if (risco >= 100) respostaCulto();
    }, 600);
    return;
  }

  entrada = entrada.replace(/1/g, ".").replace(/0/g, "-").replace(/_/g, " ");
  logMensagem(`Mensagem convertida para padrão Morse: ${entrada}`);

  barraProgresso(() => {
    setTimeout(() => {
      const palavras = entrada.split("  ");
      let resultado = "";
      for (const palavra of palavras) {
        const letras = palavra.trim().split(" ");
        for (const letra of letras) {
          resultado += morseCode[letra] || "?";
        }
        resultado += " ";
      }
      resultado = resultado.trim();

      if (resultado.replace(/\?/g, "").length === 0) {
        $("saida").innerText = "[Erro]: Nenhum resultado válido encontrado.";
        logMensagem("Decodificação falhou: sem correspondências.", "erro");
        $("dica").innerText = "DICA: Tente revisar a mensagem recebida.";
        risco += 33;
        atualizarBarraRisco();
        if (risco >= 100) respostaCulto();
        else respostaOperador();
      } else {
        // Puzzle em camadas: mostra anagrama e pede senha
        const anagrama = embaralhar(resultado.replace(/ /g, ''));
        mostrarCamadaSenha(anagrama);
        logMensagem("Decodificação concluída. Anagrama exibido no terminal.");
        easterEgg(resultado);
        $("alerta").hidden = true;
        $("copiar").classList.remove("mostrar");
        $("copiar").style.display = "none";
      }
      btn.disabled = false;
      setLoading(false);
      $("progress-bar").hidden = true;
    }, 400);
  });
}

function copiarResultado() {
  const saida = $("saida").innerText.replace(/^\[Mensagem Final de Gabriel\]:\s*/i, "");
  if (saida) {
    navigator.clipboard.writeText(saida);
    logMensagem("Mensagem copiada para a área de transferência.");
    $("copiar").innerText = "COPIADO!";
    setTimeout(() => $("copiar").innerText = "COPIAR RESULTADO", 1200);
  }
}

function ouvirCodigo() {
  playStatic();
  setTimeout(() => {
    const entrada = $("entrada").value.trim().replace(/[^01_]/g, "");
    if (!entrada) return;
    let morse = entrada.replace(/1/g, ".").replace(/0/g, "-").replace(/_/g, " ");
    let i = 0;
    function beep() {
      if (i >= morse.length) return;
      let c = morse[i];
      let dur = c === "." ? 100 : c === "-" ? 300 : 150;
      if (c === "." || c === "-") {
        let ctx = new (window.AudioContext || window.webkitAudioContext)();
        let o = ctx.createOscillator();
        let g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 700;
        g.gain.value = 0.08;
        o.connect(g).connect(ctx.destination);
        o.start();
        setTimeout(() => {
          o.stop();
          ctx.close();
          i++;
          setTimeout(beep, 80);
        }, dur);
      } else {
        i++;
        setTimeout(beep, dur);
      }
    }
    beep();
  }, 600);
}

function msgInicialGabriel() {
  const idx = Math.floor(Math.random() * mensagensGabriel.length);
  $("msg-sistema").innerHTML = mensagensGabriel[idx];
}

function configurarEventos() {
  $("processar").addEventListener("click", corrigirEDecodificar);
  $("limpar").addEventListener("click", limparCampos);
  $("copiar").addEventListener("click", copiarResultado);
  $("ouvir").addEventListener("click", ouvirCodigo);
  $("enviar-senha").addEventListener("click", verificarSenha);
  $("senha").addEventListener("keydown", function(e) {
    if (e.key === "Enter") verificarSenha();
  });
  $("entrada").addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      corrigirEDecodificar();
    }
  });
  window.addEventListener("DOMContentLoaded", () => {
    $("entrada").focus();
    setLoading(false);
    msgInicialGabriel();
    playStatic();
  });
}

configurarEventos();