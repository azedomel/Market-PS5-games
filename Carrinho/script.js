$(document).ready(function() {
    // Recupera o carrinho do localStorage
    const carrinho = JSON.parse(localStorage.getItem("Carrinho")) || [];

    // Elemento onde a lista será exibida
    const listElement = $("#lista");
    // Elemento para o total
    const totalElement = $("#total");

    // Função para exibir o carrinho
    function exibirCarrinho() {
        // Limpa o conteúdo atual da lista
        listElement.empty();

        // Variável para acumular o preço total
        let totalPreco = 0;

        // Itera sobre os itens do carrinho
        $.each(carrinho, function(index, item) {
            // Cria um elemento de lista para cada item
            const listItem = $("<li>").text(
                `${item.descricao} - Preço: $${item.preco}`
            );

            // Cria um botão de remoção do item
            const removeButton = $("<button>")
                .text("❌")
                .css("margin-left", "10px")
                .click(function() {
                    removerItemDoCarrinho(index);
                });

            // Adiciona o botão de remoção ao item da lista
            listItem.append(removeButton);
            listElement.append(listItem);

            // Incrementa o valor total
            totalPreco += item.preco;
        });

        // Exibe o total em valor dos itens
        totalElement.text(`Total: $${totalPreco}`);
    }

    // Função para remover um item do carrinho
    function removerItemDoCarrinho(index) {
        carrinho.splice(index, 1);
        localStorage.setItem("Carrinho", JSON.stringify(carrinho));
        exibirCarrinho();
    }

    // Exibe o carrinho ao carregar a página
    exibirCarrinho();
});

function gerarNumeroPedido() {
    // Gera um número de pedido fictício (exemplo: 20231025-12345)
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const numeroAleatorio = Math.floor(Math.random() * 100000);
    return `${ano}${mes}${dia}-${numeroAleatorio}`;
}

function gerarCodigoPix() {
    // Gera um código PIX fictício (exemplo: 123e4567-e89b-12d3-a456-426614174000)
    return "123e4567-e89b-12d3-a456-426614174000";
}

function enviarNotaFiscalPorEmail() {
    const listaElement = document.getElementById("lista");
    const totalElement = document.getElementById("total");

    // Clona a lista para evitar a modificação direta na lista original
    const listaClone = listaElement.cloneNode(true);
    // Remove o botão da lista para ir pro e-mail sem ele
    $(listaClone).find("button").remove();

    // Obtém a data e hora atual
    const dataAtual = new Date().toLocaleDateString();
    const horaAtual = new Date().toLocaleTimeString();

    // Gera um número de pedido e um código PIX fictício
    const numeroPedido = gerarNumeroPedido();
    const codigoPix = gerarCodigoPix();

    // Conteúdo da nota fiscal em texto simples
    let conteudoTexto = `========================================\n`;
    conteudoTexto += `           NOTA FISCAL ELETRÔNICA           \n`;
    conteudoTexto += `========================================\n\n`;
    conteudoTexto += `Número do Pedido: ${numeroPedido}\n`;
    conteudoTexto += `Data: ${dataAtual}\n`;
    conteudoTexto += `Hora: ${horaAtual}\n\n`;
    conteudoTexto += `Dados da Loja:\n`;
    conteudoTexto += `Nome: Loja de Jogos PS5\n`;
    conteudoTexto += `CNPJ: 12.345.678/0001-99\n\n`;
    conteudoTexto += `Itens do Pedido:\n`;

    $(listaClone).find("li").each(function() {
        const text = $(this).text().split(" - Preço: $");
        const descricao = text[0];
        const preco = parseFloat(text[1]);
        const quantidade = 1; // Aqui você pode adicionar a lógica para quantidade, se necessário
        const subtotal = preco * quantidade;
        conteudoTexto += `- ${descricao}\n`;
        conteudoTexto += `  Preço Unitário: $${preco.toFixed(2)}\n`;
        conteudoTexto += `  Quantidade: ${quantidade}\n`;
        conteudoTexto += `  Subtotal: $${subtotal.toFixed(2)}\n\n`;
    });

    conteudoTexto += `========================================\n`;
    conteudoTexto += `Total do Pedido: ${totalElement.textContent}\n\n`;
    conteudoTexto += `Instruções de Pagamento:\n`;
    conteudoTexto += `- Pagamento via PIX\n`;
    conteudoTexto += `  Código PIX: ${codigoPix}\n`;
    conteudoTexto += `  Validade: 24 horas\n\n`;
    conteudoTexto += `- Pagamento via Cartão de Crédito\n`;
    conteudoTexto += `  Número do Cartão: **** **** **** 1234\n`;
    conteudoTexto += `  Validade: 12/2025\n`;
    conteudoTexto += `  Código de Segurança: 123\n\n`;
    conteudoTexto += `- Pagamento via Boleto Bancário\n`;
    conteudoTexto += `  Código de Barras: 1234567890123456789012345678901234567890\n`;
    conteudoTexto += `  Vencimento: 30/11/2023\n\n`;
    conteudoTexto += `- Pagamento via Transferência Bancária\n`;
    conteudoTexto += `  Banco: 001 - Banco do Brasil\n`;
    conteudoTexto += `  Agência: 1234\n`;
    conteudoTexto += `  Conta: 123456-7\n`;
    conteudoTexto += `  Favorecido: Loja de Jogos PS5\n\n`;
    conteudoTexto += `Obrigado por sua compra! Volte sempre.\n`;
    conteudoTexto += `========================================\n`;

    // Configura o e-mail
    const email = "lojagamesps5@gmail.com"; // Substitua pelo e-mail do destinatário
    const subject = `Nota Fiscal - Pedido ${numeroPedido}`;
    const body = encodeURIComponent(conteudoTexto);

    // Abre o cliente de e-mail padrão do usuário
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    // Exibe a mensagem de sucesso
    document.getElementById("pedido").style.display = "block";
}

// Função para fechar a mensagem de sucesso
function successClose() {
    document.getElementById("pedido").style.display = "none";
}