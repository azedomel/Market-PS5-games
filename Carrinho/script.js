$(document).ready(function(){
    //recupera o carrinho do localstorage
    const carrinho = JSON.parse(localStorage.getItem("Carrinho")) || [];

    //elemento onde a lista sera exibida
    const listElement = $("#lista");
    //elemento para o total
    const totalElement = $("#total");

    //funcao para exibir o carrinho
    function exibirCarrinho(){
        //limpa o conteudo atual da lista
        listElement.empty();

        //variavel para acumular o preco total
        let totalPreco = 0;

        //itera sobre os itens do carrinho
        $.each(carrinho, function(index, item){
            //cria um elemento de lista pára cada item
            const listItem = $("<li>").text(
                `${item.descricao} - Preço: $${item.preco}`
            );

            //cria um botao de remoção do item
            const removeButton = $("<button>")
                .text("❌")
                .css("margin-left", "10px")
                .click(function(){
                    removerItemDoCarrinho(index)
                });

            //criando os filhos e pais
            listItem.append(removeButton)
            listElement.append(listItem)
            //incrementa o valor total
            totalPreco += item.preco
        });
        //imprimi o total em valor dos items
        totalElement.text(`Total: $${totalPreco}`)
    }

    function removerItemDoCarrinho(index){
        carrinho.splice(index, 1);
        localStorage.setItem("Carrinho", JSON.stringify(carrinho))
        exibirCarrinho();
    }

    exibirCarrinho();
});

function gerarDocumentoWord() {
    const listaElement = document.getElementById("lista");
    const totalElement = document.getElementById("total");

    // Clona a lista para evitar a modificação direta na lista original
    const listaClone = listaElement.cloneNode(true);
    // Remove o botão da lista para ir pro Word sem ele
    $(listaClone).find("button").remove();

    const listaHtml = listaClone.innerHTML;
    const totalHtml = totalElement.innerHTML;
// personalização da nota fiscal 
    const conteudoHtml = `
        <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table, th, td {
                        border: 1px solid #ddd;
                    }
                    th, td {
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    .total {
                        font-size: 18px;
                        font-weight: bold;
                        text-align: right;
                        margin-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        font-size: 14px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <h1>Nota Fiscal</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${$(listaClone).find("li").map(function() {
                            const text = $(this).text().split(" - Preço: $");
                            return `<tr>
                                        <td>${text[0]}</td>
                                        <td>$${text[1]}</td>
                                    </tr>`;
                        }).get().join("")}
                    </tbody>
                </table>
                <div class="total">${totalHtml}</div>
                <div class="footer">
                    Obrigado por sua compra! Volte sempre.
                </div>
            </body>
        </html>
    `;

    const blob = new Blob([conteudoHtml], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nota_fiscal.doc";
    link.click();

    document.getElementById("pedido").style.display = "block";
}