const sharp = require("sharp");
const fs = require("fs");

async function redimensionaImagem(inputImagePath, outputImagePath, width, height) {
	try {
		await sharp(inputImagePath)
			.resize(width, height)
			.toFile(outputImagePath);
		console.log("Imagem redimensionada com sucesso ");
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

async function adicionarMarcaDagua(inputImagePath, outputImagePath, text, x, y) {
	try {
		const image = sharp(inputImagePath);
		const { width: imageWidth, height: imageHeight } = await image.metadata();
		// svg pode ser usada para desenhar vetores gráficos
		const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}">
                <text x="${x}" y="${y}" font-family="Arial" font-size="30" fill="white">${text}</text>
            </svg>`;
		await image
			.composite([{
				input: Buffer.from(svgContent)
			}])
			.toFile(outputImagePath);

		console.log("Marca d'água adicionada com sucesso");
	} catch (error) {
		console.error("Ocorreu um erro ao adicionar a marca d'água");
	}
}

const args = process.argv.slice(2);

if (args.length < 3) {
	console.error('Ocorreu um erro: Não foi fornecido um caminho válido para a imagem');
	process.exit(1);
}

const comando = args[0];
const inputImagePath = args[1];
const outputImagePath = args[2];

if (comando === 'redimensiona') {
	if (args.length !== 5) {                       //          1                   2              3          4    
		console.error('Usar: node index.js redimensiona <caminho da imagem> <saída da imagem> <largura> <altura>');
		process.exit(1);
	}
	const width = parseInt(args[3]);
	const height = parseInt(args[4]);
	redimensionaImagem(inputImagePath, outputImagePath, width, height);
} else if (comando === 'corte') {
	if (args.length !== 7) {                  //           1                 2             3         4         5          6                
		console.error('Usar: node index.js corte <caminho da imagem> <saída da imagem> <largura> <altura> <esquerda> <principal>');
		process.exit(1);
	}
	const width = parseInt(args[3]);
	const height = parseInt(args[4]);
	const left = parseInt(args[5]);
	const top = parseInt(args[6]);
	cortarImagem(inputImagePath, outputImagePath, width, height, left, top);
} else if (comando === 'marca') {
	if (args.length !== 6) {                 //        1                    2                   3           4   5    
		console.error('Usar: node index.js marca <caminho da imagem> <saída da imagem> <mensagem de texto> <x> <y>');
		process.exit(1);
	}
	const text = args[3];
	const x = parseInt(args[4]);
	const y = parseInt(args[5]);
	adicionarMarcaDagua(inputImagePath, outputImagePath, text, x, y);
} else {
	console.error('Comando inválido. Use "redimensionar", "corte" ou "marca".');
	process.exit(1);
}
