import { createCanvas, Image, loadImage, registerFont } from 'canvas'
import { globalState } from './globalState.js'
import * as fs from 'node:fs'

registerFont(helper.path.appDir.join('plugins/YuLu/resource/font/font.ttf').str, { family: 'Custom' })

const headSize = 120    //头像尺寸
const spacing = 40    //元素之间的空隙
const canvasWidth = 600
const backgroundColor = 'black'
const color = 'white'
const fontSize = 24

/**
 * 创建语录图片
 * @param {any[]} yulu 语录，结构体
 * @param {string} nickName 群名片
 * @param {Buffer} headImg 头像图像数据
 * @param {number} groupId
 * @param {Bot} bot
 * @return {Promise<Buffer>}
 */
export async function createImg (yulu, nickName, headImg, groupId, bot) {
    const canvas = createCanvas(canvasWidth, headSize + spacing * 2)
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    //修改高度
    ctx.font = `bold ${fontSize}px Custom`
    let contentMaxWidth = canvasWidth - headSize - spacing * 3
    let re = await parseYulu(ctx, contentMaxWidth, yulu, groupId, bot)
    let text = re.text
    let canvasHeight = spacing * 2 + fontSize * (re.lineCount + 2) + fontSize
    if (re.imgs) {   //计算图片
        for (let img of re.imgs) {
            let targetHeight = (contentMaxWidth / img.width) * img.height
            let height = targetHeight + fontSize
            canvasHeight += height
        }
    }
    if (canvasHeight < headSize + spacing * 2) {    //最小值
        canvasHeight = headSize + spacing * 2
    }
    canvas.height = canvasHeight

    ctx.fillStyle = backgroundColor
    ctx.font = `bold ${fontSize}px Custom`

    // 填充背景色（可选）
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.save()

    // 绘制头像
    const image = await loadImage(headImg)
    const scale = Math.min(headSize / image.width, headSize / image.height)
    const scaledWidth = image.width * scale
    const scaledHeight = image.height * scale
    ctx.beginPath()
    ctx.arc(spacing + headSize / 2, spacing + headSize / 2, headSize / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(image, spacing, spacing, scaledWidth, scaledHeight)
    ctx.restore()

    // 绘制语录
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    let textX = spacing * 2 + headSize
    let textY = spacing

    if (text !== '') {
        textY += fontSize
        ctx.fillStyle = color
        ctx.fillText(text.replace(/\n{3,}/g, '\n\n'), textX, textY)
        textY = spacing + fontSize * (re.lineCount + 1)
    }

    //绘制图片
    if (re.imgs) {
        for (let img of re.imgs) {
            let targetWidth = contentMaxWidth
            let targetHeight = (targetWidth / img.width) * img.height
            ctx.drawImage(img, textX, textY, targetWidth, targetHeight)
            textY = textY + targetHeight + fontSize
        }
    }

    //绘制作者
    ctx.textAlign = 'right'
    textX = canvasWidth - spacing * 2
    textY = textY + fontSize * 2
    ctx.fillText(`—— ${nickName}`, textX, textY)

    return canvas.toBuffer('image/jpeg')
}

async function parseYulu (ctx, maxWidth, yulu, groupId, bot) {
    let text = ''
    /** @type {Image[]} */
    let imgs = []
    for (let element of yulu) {
        switch (element.type) {
            case 'text':
                text += element.data.text
                break
            case 'at':
                let at = element.data.qq
                if (at === 'all') {
                    text += `@全体成员 `
                } else {
                    let re = await bot.Api.getGroupMemberInfo(groupId, Number(at))
                    let nick = re.card || re.nickname
                    text += `@${nick} `
                }
                break
            case 'image':
                let img = fs.readFileSync(`${globalState.dataImgPath}\\${element.data.file}`)
                if (img) imgs.push(await loadImage(img))
                break
            default:
                break
        }
    }

    let newText = ['']
    for (const char of text.trim()) {
        if (char === '\n') {
            newText.push('')
            continue
        }
        let lineCount = newText.length - 1
        newText[lineCount] += char
        const metrics = ctx.measureText(newText[lineCount])
        const width = metrics.width

        if (maxWidth - width < fontSize) {
            newText.push('')
        }
    }

    return { text: newText.join('\n'), lineCount: newText.length, imgs: imgs.length > 0 ? imgs : null }
}
