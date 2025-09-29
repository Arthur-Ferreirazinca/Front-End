// Event listener para o formulário de simulação
document.getElementById("financeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Obtém valores dos campos
  const valor = parseFloat(document.getElementById("valorFinanciado").value);
  const entrada = parseFloat(document.getElementById("valorEntrada").value);
  const juros = parseFloat(document.getElementById("juros").value) / 100; // Converte para decimal
  const meses = parseInt(document.getElementById("meses").value);

  // Calcula valores do financiamento
  const valorFinal = valor - entrada;
  const parcela = (valorFinal * juros) / (1 - Math.pow(1 + juros, -meses));
  const totalPago = parcela * meses;

  // Exibe resultados
  document.getElementById("resultado").innerHTML = `
    <h5>Resultado:</h5>
    <p>Valor Financiado: R$ ${valorFinal.toFixed(2)}</p>
    <p>Parcela Mensal: R$ ${parcela.toFixed(2)}</p>
    <p>Total Pago: R$ ${totalPago.toFixed(2)}</p>
  `;

  // Salva no localStorage
  const historico = JSON.parse(localStorage.getItem("historicoFinanciamentos")) || [];

  historico.push({
    data: new Date().toLocaleString(),
    valor,
    entrada,
    juros: juros * 100, // Converte para porcentagem
    meses,
    valorFinal: valorFinal.toFixed(2),
    parcela: parcela.toFixed(2),
    totalPago: totalPago.toFixed(2)
  });

  localStorage.setItem("historicoFinanciamentos", JSON.stringify(historico));

  // Envia para o MySQL se o usuário estiver logado
  const usuario_id = localStorage.getItem("usuario_id");
  if (usuario_id) {
    await fetch("http://localhost/anao/simuladorPHP/salvar_simulacao.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id,
        data: new Date().toISOString(),
        valor,
        entrada,
        juros: juros * 100,
        meses,
        valorFinal: valorFinal.toFixed(2),
        parcela: parcela.toFixed(2),
        totalPago: totalPago.toFixed(2)
      })
    });
  }
});