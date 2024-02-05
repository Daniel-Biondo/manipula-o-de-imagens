const sharp = require("sharp");
const fs = require("fs");

async function redimensionaImagem(inputImagePath, outputImagePath, width, height) {
    try {
        await sharp(inputImagePath)
            .resize(width, height)
            .toFile(outputImagePath);
        console.log("Imagem redimensionda com sucesso ");
    } catch (erro) {
        console.error("Ocorreu um erro em redimensionar a imagem,tamanho inválido");
    }
}

async function cortarImagem(inputImagePath, outputImagePath, width, height, left, top) {
    try {
        await sharp(inputImagePath)
            .extract({ width, height, left, top })
            .toFile(outputImagePath);
        console.log("Imagem recortada com sucesso ");
    } catch (error) {
        console.error("Ocorreu um erro em recortar a imagem,tamanho inválido");
    }
}

const args = process.argv.slice(2); //2 descartará ambos e retornará todo o resto que foi digitado na linha de comando

if (args.length < 3) {
    console.error('Ocorreu um erro isso não é um caminho ');
    process.exit(1); //1 significa encerrar o processo com alguma falha.
}

const comando = args[0];
const inputImagePath = args[1];
const outputImagePath = args[2];

if (comando === 'redimensiona') {
    if (args.length !== 5) {                        //     1                2                3        4
        console.error('Usar: node index.js redimensiona <inputImagePath> <outputImagePath> <width> <height>');
        process.exit(1);
    }
    const width = parseInt(args[3]);
    const height = parseInt(args[4]);
    redimensionaImagem(inputImagePath, outputImagePath, width, height);
} else if (comando === 'corte') {
    if (args.length !== 7) {                    //  1                2                3       4         5     6
        console.error('Usar: node index.js corte <inputImagePath> <outputImagePath> <width> <height> <left> <top>');
        process.exit(1);
    }
    const width = parseInt(args[3]);
    const height = parseInt(args[4]);
    const left = parseInt(args[5]);
    const top = parseInt(args[6]);
    cortarImagem(inputImagePath, outputImagePath, width, height, left, top);
} else {
    console.error('Comando inválido. Use "redimensionar " ou "corte".');
    process.exit(1);
}