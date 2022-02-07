import { readdirSync, readFileSync } from 'fs'
import { useQuery } from 'h3'
import type { IncomingMessage, ServerResponse } from 'http'
import { marked } from 'marked'
import matter from 'gray-matter'

interface IFileContent {
    meta: object;
    content: string;
}

/**
 * Get the markdown files.
 * 
 * @param start base starting file (default start after the first file)
 * @param max max files to get
 */
export const getContent = (start: number = 1, max: number = 4): IFileContent[] => {
    console.log(process.cwd())
    const directoryPath = process.cwd() + '/content'
    const filenames = readdirSync(directoryPath).slice(start - 1, start - 1 + max);

    // /!\ avoid compatibility errors between jest-ts and nuxt 3 nitro
    let read: any
    try {
        read = matter.read
    } catch (err) {
        const matter = require('gray-matter')
        read = matter.read
    }

    const filesContent = filenames.map(filename => read(`${directoryPath}/${filename}`))
    return filesContent.map(file => {
        return { meta: file.data, content: marked(file.content) }
    })
}

export default (req: IncomingMessage, res: ServerResponse) => {
    const query = useQuery(req)
    const start = Number(query.start) | 1
    const end = Number(query.end) | 4
    return getContent(start, end)
}

