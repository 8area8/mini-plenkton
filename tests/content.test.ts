import { getContent } from "../server/api/content"
import { mocked } from 'jest-mock'

jest.mock('fs');
import * as fs from 'fs'
const mockFs = mocked(fs)


test('Content is marked', () => {
    const TestData: string = 'content1';
    mockFs.readdirSync.mockReturnValue(["file1"] as any)
    mockFs.readFileSync.mockReturnValue(TestData);

    const files = getContent()
    const file = files[0]
    expect(file.content).toBe("<p>content1</p>\n")
});

test('Content has meta', () => {
    const TestData: string = '---\ntitle: testTitle\n---\ncontent1';
    mockFs.readdirSync.mockReturnValue(["file1"] as any)
    mockFs.readFileSync.mockReturnValue(TestData);

    const files = getContent()
    const file = files[0]
    expect(file.meta).toEqual({ title: "testTitle" })
});

test('Content gets 1 file', () => {
    const TestData: string = 'content1';
    mockFs.readdirSync.mockReturnValue(["file1"] as any)
    mockFs.readFileSync.mockReturnValue(TestData);

    const files = getContent()
    expect(files).toHaveLength(1)
    const file = files[0]
    expect(file.content).toBe("<p>content1</p>\n")
});

test('Content when we start at 2', () => {
    const testData: string[] = ['content2', 'content3', 'content4', 'content5'];
    mockFs.readdirSync.mockReturnValue(["1", '2', '3', '4', '5', '6'] as any)
    for (const data of testData) {
        mockFs.readFileSync.mockReturnValueOnce(data)
    }

    const files = getContent(2)
    expect(files).toHaveLength(4)
    let index = 2
    for (const file of files) {
        expect(file.content).toBe(`<p>content${index}</p>\n`)
        index++
    }
});

test('Content when we start at 2, ends at 3', () => {
    const testData: string[] = ['content2', 'content3', 'content4'];
    mockFs.readdirSync.mockReturnValue(["1", '2', '3', '4', '5', '6'] as any)
    for (const data of testData) {
        mockFs.readFileSync.mockReturnValueOnce(data)
    }

    const files = getContent(2, 3)
    expect(files).toHaveLength(3)
    let index = 2
    for (const file of files) {
        expect(file.content).toBe(`<p>content${index}</p>\n`)
        index++
    }
});
