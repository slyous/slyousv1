import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                // TITLE PAGE
                new Paragraph({
                    text: "INVESTMENT PROPOSAL",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 2000, after: 400 },
                }),
                new Paragraph({
                    text: "VELOURA DIAMONDS",
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 2000 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Redefining the Luxury Diamond Experience", italics: true }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 4000 },
                }),
                new Paragraph({
                    text: "Prepared For: Investors & Stakeholders",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "Date: " + new Date().toLocaleDateString(),
                    alignment: AlignmentType.CENTER,
                    pageBreakBefore: false,
                }),

                // PAGE BREAK
                new Paragraph({ text: "", pageBreakBefore: true }),

                // EXECUTIVE SUMMARY
                new Paragraph({
                    text: "1. Executive Summary",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Veloura Diamonds ", bold: true }),
                        new TextRun("is a modern, digitally-native luxury jewelry brand seeking to redefine the diamond purchasing experience. We are bridging the gap between uncompromising ethically sourced craftsmanship and accessible luxury. By cutting out intermediaries and leveraging a direct-to-consumer (DTC) model, Veloura delivers exceptional light performance, masterfully cut diamonds, and unparalleled transparency to a new generation of buyers."),
                    ],
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "We are seeking Seed Funding to scale our digital infrastructure, expand our inventory of ethically sourced diamonds, and launch a targeted omnichannel marketing campaign to capture market share in the rapidly evolving luxury jewelry sector.",
                    spacing: { after: 400 },
                }),

                // THE OPPORTUNITY & PROBLEM
                new Paragraph({
                    text: "2. The Opportunity & Problem",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "The Problem",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                }),
                new Paragraph({ text: "• Lack of Transparency: Consumers are often confused by pricing models and certification standards, leading to distrust.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Ethical Concerns: Modern buyers demand conflict-free, traceable origins, which legacy jewelers struggle to guarantee.", bullet: { level: 0 } }),
                new Paragraph({ text: "• High Markups: Multiple intermediaries (miners, cutters, wholesalers, brokers, and retailers) inflate the final retail price by up to 300%.", bullet: { level: 0 }, spacing: { after: 200 } }),

                new Paragraph({
                    text: "The Veloura Solution",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                }),
                new Paragraph({ text: "• Direct Relationships: We traverse the globe to establish direct relationships with ethically sound cutting facilities.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Education-First Approach: We educate buyers on light performance and the 4Cs through an intuitive digital platform.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Fair Pricing: By eliminating middlemen, we pass significant savings onto the consumer without compromising prestige.", bullet: { level: 0 }, spacing: { after: 400 } }),

                // MARKET ANALYSIS
                new Paragraph({
                    text: "3. Market Analysis",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({ text: "• Market Size: The global luxury jewelry market is projected to reach over $40 Billion by 2028.", bullet: { level: 0 } }),
                new Paragraph({ text: "• E-Commerce Growth: Online sales of luxury goods are growing at 3x the rate of physical retail. Digital-first luxury is the expectation.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Target Demographic: High Earning, Not Rich Yet (HENRYs), Millennials, and Gen Z entering peak marriage and high-income earning years.", bullet: { level: 0 }, spacing: { after: 400 } }),

                // BUSINESS MODEL
                new Paragraph({
                    text: "4. Business Model & Competitive Advantage",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "Veloura operates on a high-margin, low-overhead model compared to traditional retail. Our primary revenue stream is direct-to-consumer sales of loose diamonds, bespoke engagement rings, and fine jewelry.",
                    spacing: { after: 200 },
                }),
                new Paragraph({ text: "• Omnichannel Digital Experience: State-of-the-art web application offering a frictionless browsing and checkout experience.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Ethical Sourcing Guarantee: Every stone is meticulously traced from mine to market.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Global Presence: A hybrid model combining our powerful e-commerce engine with strategic physical showrooms in global capitals.", bullet: { level: 0 }, spacing: { after: 400 } }),

                // FINANCIALS
                new Paragraph({
                    text: "5. Funding Request & Use of Funds",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "We are seeking ", bold: true }),
                        new TextRun({ text: "$2.0M", bold: true, underline: {} }),
                        new TextRun({ text: " in Seed capital.", bold: true }),
                    ],
                    spacing: { after: 200 },
                }),
                new Paragraph({ text: "• Marketing & Customer Acquisition (40%): Aggressive digital campaigns, influencer partnerships, and brand positioning.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Inventory Expansion (30%): Securing exclusive rights to high-quality rough and polished stones.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Technology & Operations (20%): Scaling our proprietary e-commerce backend and integrating AR try-on features.", bullet: { level: 0 } }),
                new Paragraph({ text: "• Working Capital (10%): Operational runway and unforeseen expenses.", bullet: { level: 0 }, spacing: { after: 400 } }),

                // CONCLUSION
                new Paragraph({
                    text: "6. Conclusion",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "Veloura is not just a diamond retailer; it is a lifestyle brand built on trust, elegance, and modernity. We invite you to join us in redefining how the world experiences and acquires its most enduring creations.",
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Contact: ", bold: true }),
                        new TextRun("concierge@veloura.com | +1 548 705 7044 | www.veloura.com"),
                    ],
                    spacing: { after: 400 },
                }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Veloura_Investment_Proposal.docx", buffer);
    console.log("Document created successfully");
});
