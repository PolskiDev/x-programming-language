# Linguagem de programação X

###### "Qualquer um é livre para copiar, modificar e distribuir este software em formato de código-fonte ou binários executáveis"


A linguagem de programação X foi desenvolvida para propósitos educacionais e de pesquisa, junto ao livro *"Transpiladores - Técnicas e Ferramentas"* de Gabriel Margarido, disponível gratuitamente [aqui](http://xlang.gabrielmargarido.org/books/1a-edicao.pdf).

#### [Documentação: Transpiladores - Técnicas e Ferramentas](http://xlang.gabrielmargarido.org/book/1a-edicao.pdf)
## Compilar  a partir do código-fonte
**Requisitos:**
- Node.js ([Runtime Javascript](https://nodejs.org/pt-br/))
- NPM ([Gerenciador de Pacotes](https://www.npmjs.com/))
- [GNU Makefile](https://community.chocolatey.org/packages/make#install)
- PKG ([Módulo NPM](https://www.npmjs.com/package/pkg))
#### Compilar a partir dos fontes para binários XCC e XPM
```
    $> unzip *.zip
    $> cd zip/src
    $> make

    $> ./xcc -version
    $> ./xpm -version
```
#### Interpretar XCC e XPM
```
    $> unzip *.zip
    $> cd zip
    $> sudo chmod +X xcc.sh xpm.sh

    $> ./xcc.sh -version
    $> ./xpm.sh -version
```

##  Interpretado ou compilado para binários
O pacote com o código-fonte da linguagem X, pode ser interpretado a partir do runtime Javascript Node.js ou ser compilado para versão binária através do Makefile dentro do diretório "src". Vale ressaltar, que a versão binária pode ser utilizada, a partir de dois binários, um para compilação de código-fonte e outro para gerenciamento de pacotes, enquanto a versão interpretada necessita de todo o diretório com o código-fonte para a execução do compilador.

## Compilador XCC
A linguagem X é uma linguagem de programação que compila o código escrito para TypeScript, e depois automaticamente para Javascript. Sendo a parte de interpretação tratada pela Máquina Virtual V8, Webkit ou qualquer outro ambiente de execução Javascript. X funciona em navegadores e até em Node.js, apenas utilizando a instrução *@use_node* dentro do código-fonte do programa. O Compilador XCC cuidará de tudo para você.


## Gerenciador de pacotes XPM
A linguagem X também conta com um gerenciador para pacotes hospedados online (podendo ser em qualquer URL), chamado XPM (X Package Manager). Em alguns pontos, pode-se dizer que é um NPM melhorado, pois possui um cache global de bibliotecas dentro do Sistema Operacional e o arquivo deps.config, que armazena quais módulos baixados da internet estão sendo utilizados naquele projeto e o comando **xpm --config** realiza o download das dependências automaticamente.

## Bibliotecas para extensão de código
Bibliotecas TypeScript podem extender as funcionalidades do compilador. Podendo estas mesmas bibliotecas ser chamadas em código escrito em linguagem X.

## Construído do zero
A linguagem X teve seu compilador (transpilador) construído do absoluto zero em TypeScript puro. Podendo ter o mesmo princípio de funcionamento (descrito aqui) aplicado em praticamente qualquer linguagem de programação de alto-nível.


## Desenvolvimento
O foco da linguagem X é servir de modelo para construção de compiladores em qualquer linguagem de programação, sendo um modelo de código-aberto, interoperável com a linguagem alvo e de fácil análise e programação. X é desenvolvida em linguagem TypeScript, mas poderia ser desenvolvida em qualquer outra linguagem. Como por exemplo: Javascript, C++, C, Lua, PHP, Java, Kotlin, Scala, Python, entre outras...


## Software Livre
Todo o código-fonte da linguagem de programação X é distribuído gratuitamente, de forma livre e aberta sob a licença **FreeBSD de 2 cláusulas**.    

## Instalar Extensão para Visual Studio Code
Para instalar a extensão para Visual Studio Code
Mova o diretório "xlang-vscode" para:

```
$>  unzip xlang-vscode.zip
$>  mv vscode/xlang-vscode $HOME/.vscode/extensions/xlang-vscode
```

- Windows:		```%USERPROFILE%\.vscode\extensions\xlang-vscode```
- MacOS X:	  	```$HOME/.vscode/extensions/xlang-vscode```
- GNU/Linux: 	```$HOME/.vscode/extensions/xlang-vscode```