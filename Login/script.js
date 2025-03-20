function login(){
    document.getElementById("nome").style.border = "2px solid pink"
    document.getElementById("senha").style.border = "2px solid pink"
    document.getElementById("error-modal").style.display = "none"
    var nome = $("#nome").val()
    var senha = $("#senha").val()
    console.log(nome,senha)

    if(nome && senha && nome === "admin" && senha === "1234"){
        const user ={
            name: nome,
            dataEntrada: new Date(),
            id: Math.floor(Math.random() * 100000)
        }
        localStorage.setItem("usuario", JSON.stringify(user))

        window.location.href="../Loja"
    }
        else{
            document.getElementById("error-modal").style.display = "flex"
            document.getElementById("nome").style.border = "2px solid pink"
            document.getElementById("senha").style.border = "2px solid pink"
        }
    }

    //funcao para ativar o enter como opcao de entrada
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          document.getElementById(login());
        }
      });

    function fecharError(){
    document.getElementById("nome").style.border = "2px solid pink"
    document.getElementById("senha").style.border = "2px solid pink"
    document.getElementById("error-modal").style.display = "none"
    }

    function showPassword(){
        var inputSenha = document.querySelector("#senha")
        if(inputSenha.getAttribute("type") === "password"){
            inputSenha.setAttribute("type", "text")
        }
        else{
            inputSenha.setAttribute("type", "password")
        }
    }