import csv from 'csv-parser'
import fs from 'fs'
import { createObjectCsvWriter } from 'csv-writer'

interface Info {
    Company: string
    'Contact Name': string
    'Job Title': string
    message: string
}

const info: Info[] = []

function createMessage(company: string, name: string, role: string): string {
    const greeting = `Hi ${name},\n\nHope you're doing well!`
    const paragraph = `I'm currently looking for my next opportunity and came across the ${role} role at ${company}. I would love to connect with you to learn more about you, the role, and your experience at ${company.length <= 'the company'.length ? company : 'the company'}. When are you free this week to chat?`
    let result = greeting + ' ' + paragraph
    if (result.length > 300) result = `Message exceeded 300 characters. Original message:\n\n${result}`
    return result
}

function writeCSV(data: Info[]) {
    // Define the CSV file header
    const csvWriter = createObjectCsvWriter({
        path: 'output.csv',
        header: [
          { id: 'Company', title: 'Company' },
          { id: 'Contact Name', title: 'Contact Name' },
          { id: 'Job Title', title: 'Job Title' },
          { id: 'message', title: 'Message'}
        ]
      })

    // Write data to the CSV file
    csvWriter
    .writeRecords(data)
    .then(() => {
        console.log('CSV file has been written successfully.');
    })
    .catch(err => {
        console.error('Error writing CSV file:', err);
    });
}

fs.createReadStream('2024 Job Tracker - Sheet3.csv').pipe(csv()).on('data', (data: Info) => {
    const company = data['Company']
    const contactName = data['Contact Name']
    let role = data['Job Title'].trim()
    // Sometimes the job title includes quotes due to copying and pasting in Google sheets.
    if (role.includes(`\"`)) {
        role = role.substring(0, role.length-2)
    }
    const firstName = contactName.split(' ')[0]
    const message = createMessage(company, firstName, role)
    info.push({ ...data, message })
}).on('end', () => {
    writeCSV(info)
    console.log('Script completed.')
})