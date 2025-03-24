$(document).ready(function () {
    // Recupera o carrinho do localStorage
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

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
        $.each(carrinho, function (index, item) {
            // Cria um elemento de lista para cada item
            const listItem = $("<li>").text(
                `${item.descricao} - Preço: $${item.preco}`
            );

            // Cria um botão de remoção do item
            const removeButton = $("<button>")
                .text("❌")
                .css("margin-left", "10px")
                .click(function () {
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
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        exibirCarrinho();
    }

    // Exibe o carrinho ao carregar a página
    exibirCarrinho();
});

function gerarDocumentoWord() {
    const mensagem = document.getElementById('pedido');
    mensagem.style.display = 'block';

    setTimeout(() => {
        mensagem.style.display = 'none';
    }, 10000);

    console.log('Finalizando a compra e gerando o documento Word...');
    

    const listaElement = document.getElementById("lista");
    const totalElement = document.getElementById("total");

    // Clona a lista para evitar a modificação direta na lista original
    const listaClone = listaElement.cloneNode(true);
    // Remove o botão da lista para ir pro Word sem ele
    $(listaClone).find("button").remove();

    // Obtém a data e hora atual
    const dataAtual = new Date().toLocaleDateString();
    const horaAtual = new Date().toLocaleTimeString();

    // Gera um número de pedido fictício
    const numeroPedido = `PED-${Math.floor(Math.random() * 100000)}`;

    // Cria o conteúdo HTML da nota fiscal
    const conteudoHtml = `
        <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        color: #2c3e50;
                        text-align: center;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .total {
                        font-weight: bold;
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <h1>NOTA FISCAL ELETRÔNICA</h1>
                <p><strong>Número do Pedido:</strong> ${numeroPedido}</p>
                <p><strong>Data:</strong> ${dataAtual}</p>
                <p><strong>Hora:</strong> ${horaAtual}</p>
                <p><strong>Dados da Loja:</strong></p>
                <ul>
                    <li><strong>Nome:</strong> Loja de Jogos PS5</li>
                    <li><strong>CNPJ:</strong> 12.345.678/0001-99</li>
                </ul>
                <h2>Itens do Pedido</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Preço Unitário</th>
                            <th>Quantidade</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${$(listaClone)
                            .find("li")
                            .map(function () {
                                const text = $(this).text().split(" - Preço: $");
                                const descricao = text[0];
                                const preco = parseFloat(text[1]);
                                const quantidade = 1; // Lógica para quantidade, se necessário
                                const subtotal = preco * quantidade;
                                return `
                                    <tr>
                                        <td>${descricao}</td>
                                        <td>$${preco.toFixed(2)}</td>
                                        <td>${quantidade}</td>
                                        <td>$${subtotal.toFixed(2)}</td>
                                    </tr>
                                `;
                            })
                            .get()
                            .join("")}
                    </tbody>
                </table>
                <p class="total"><strong>Total do Pedido:</strong> ${totalElement.textContent}</p>
                <h2>Instruções de Pagamento</h2>
                <ul>
                    <li><strong>PIX:</strong> 123e4567-e89b-12d3-a456-426614174000</li>
                    <li><strong>Cartão de Crédito:</strong> **** **** **** 1234</li>
                    <li><strong>Boleto Bancário:</strong> 1234567890123456789012345678901234567890</li>
                    <li><strong>Transferência Bancária:</strong> Banco do Brasil - Agência 1234 - Conta 123456-7</li>
                </ul>
                <p>Obrigado por sua compra! Volte sempre.</p>
            </body>
        </html>
    `;

    // Cria um arquivo Word (.doc) com o conteúdo HTML
    const blob = new Blob([conteudoHtml], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nota_fiscal.doc";
    link.click();

    // Exibe a mensagem de sucesso
    document.getElementById("pedido").style.display = "block";
}

function successClose() {
    document.getElementById("pedido").style.display = "none";
}
