// ==================== Finance AI Assistant ====================

const financeQA = [
  // ===== 1. Budgeting =====
  { question: "What is a budget?", topic: "Budget Basics", answer: "A budget is a plan that outlines your income and expenses over a specific period, helping you manage your money effectively." },
  { question: "How do I create a budget?", topic: "Budget Planning", answer: "List all sources of income, track all expenses, categorize them, and compare your spending to your income to ensure you don’t overspend." },
  { question: "What is the 50/30/20 rule?", topic: "Budgeting Strategies", answer: "It’s a budgeting guideline where 50% of income goes to needs, 30% to wants, and 20% to savings or debt repayment." },
  { question: "How can I reduce monthly expenses?", topic: "Expense Management", answer: "Cut non-essential spending, negotiate bills, switch to cheaper alternatives, and track spending to identify unnecessary costs." },
  { question: "What are fixed expenses?", topic: "Expense Types", answer: "Fixed expenses are costs that stay the same each month, like rent, mortgage, or subscription services." },
  { question: "What are variable expenses?", topic: "Expense Types", answer: "Variable expenses change month to month, such as groceries, entertainment, and utility bills." },
  { question: "How much should I spend on rent?", topic: "Housing Budget", answer: "A common guideline is to spend no more than 30% of your monthly income on rent." },
  { question: "How do I track spending?", topic: "Budget Tracking", answer: "Use apps, spreadsheets, or a notebook to record every purchase and categorize it to see where your money goes." },
  { question: "What budgeting apps are available?", topic: "Budget Tools", answer: "Popular apps include Mint, YNAB (You Need a Budget), PocketGuard, and Goodbudget." },
  { question: "How do I budget with irregular income?", topic: "Irregular Income Budgeting", answer: "Base your budget on your lowest expected income, prioritize essentials, and save any extra for future months." },
  { question: "How often should I review my budget?", topic: "Budget Review", answer: "Ideally, review your budget monthly to adjust for changes in income or expenses." },
  { question: "What is zero-based budgeting?", topic: "Budgeting Methods", answer: "A method where every dollar of income is assigned a purpose, so income minus expenses equals zero at the end of the month." },
  { question: "How do I budget for groceries?", topic: "Budgeting Essentials", answer: "Set a monthly grocery limit, plan meals, make shopping lists, and track receipts to avoid overspending." },
  { question: "How do I budget for entertainment?", topic: "Budgeting Wants", answer: "Allocate a specific amount for entertainment in your budget and choose activities that fit within that limit." },
  { question: "How do I handle unexpected expenses?", topic: "Emergency Fund", answer: "Maintain an emergency fund of 3–6 months’ worth of essential expenses to cover unexpected costs." },
  { question: "Why is budgeting important?", topic: "Budget Benefits", answer: "Budgeting helps prevent overspending, reduces financial stress, and allows you to save and plan for future goals." },
  { question: "How do I budget as a student?", topic: "Student Budgeting", answer: "Track income from part-time work or allowances, prioritize essentials like tuition and food, and limit discretionary spending." },
  { question: "How do I budget as a family?", topic: "Family Budgeting", answer: "Combine incomes, track all family expenses, set shared financial goals, and involve everyone in spending decisions." },
  { question: "How do I stick to a budget?", topic: "Budget Discipline", answer: "Automate savings, track spending regularly, set realistic limits, and review your budget to stay accountable." },
  { question: "What are common budgeting mistakes?", topic: "Budgeting Pitfalls", answer: "Overspending on wants, underestimating expenses, not tracking spending, failing to save, and ignoring irregular costs." },

  // ===== 2. Saving =====
  { question: "What does saving money mean?", topic: "Saving Basics", answer: "Saving means setting aside money for future needs, goals, or emergencies instead of spending it immediately." },
  { question: "Why is saving important?", topic: "Saving Benefits", answer: "Saving provides financial security, helps cover emergencies, and allows you to achieve short- and long-term goals." },
  { question: "How much should I save each month?", topic: "Saving Goals", answer: "A common guideline is to save at least 20% of your income each month, but even small amounts help build a habit." },
  { question: "What is an emergency fund?", topic: "Emergency Fund", answer: "An emergency fund is money set aside to cover unexpected expenses like medical bills, car repairs, or job loss." },
  { question: "How much should an emergency fund have?", topic: "Emergency Fund", answer: "Ideally, it should cover 3–6 months of essential living expenses." },
  { question: "Where should I keep my savings?", topic: "Saving Accounts", answer: "Keep savings in a safe, accessible place like a savings account, money market account, or other low-risk financial products." },
  { question: "How can I save money fast?", topic: "Saving Strategies", answer: "Cut non-essential spending, automate transfers to savings, and consider side income to boost your savings quickly." },
  { question: "How do I save on a low income?", topic: "Saving Strategies", answer: "Focus on small, consistent savings, track spending, and prioritize essential expenses while avoiding debt." },
  { question: "What is automatic saving?", topic: "Saving Methods", answer: "Automatic saving is when money is transferred from your checking to savings account on a set schedule without manual effort." },
  { question: "How do I save for a big purchase?", topic: "Saving Goals", answer: "Set a specific goal, determine how much you need, break it into smaller monthly targets, and track progress." },
  { question: "What is a savings account?", topic: "Saving Accounts", answer: "A savings account is a bank account where you can securely store money while earning interest over time." },
  { question: "How do interest rates affect savings?", topic: "Saving Growth", answer: "Higher interest rates increase the amount your savings grow over time, while low rates limit growth." },
  { question: "How do I save money as a student?", topic: "Student Saving", answer: "Limit discretionary spending, use student discounts, and save small portions of any income or allowance." },
  { question: "How do I save money as a family?", topic: "Family Saving", answer: "Plan budgets together, cut unnecessary expenses, and set shared savings goals for future needs or emergencies." },
  { question: "How do I stop spending and save more?", topic: "Saving Discipline", answer: "Track all expenses, identify unnecessary spending, set a budget, and automate transfers to savings." },
  { question: "What is short-term saving?", topic: "Saving Goals", answer: "Short-term saving is setting aside money for goals or expenses expected within the next year or two." },
  { question: "What is long-term saving?", topic: "Saving Goals", answer: "Long-term saving is building funds for goals more than two years away, like retirement, a house, or education." },
  { question: "How does inflation affect savings?", topic: "Saving Growth", answer: "Inflation reduces the purchasing power of money, so savings need to grow faster than inflation to maintain value." },
  { question: "How often should I review my savings?", topic: "Saving Review", answer: "Review savings monthly or quarterly to track progress, adjust goals, and ensure funds are allocated correctly." },
  { question: "What are common saving mistakes?", topic: "Saving Pitfalls", answer: "Common mistakes include not saving at all, overspending, neglecting emergency funds, and not taking advantage of interest or investments." },

  // ===== 3. Investing =====
  { question: "What is investing?", topic: "Investing Basics", answer: "Investing is using money to buy assets like stocks, bonds, or real estate to grow wealth over time." },
  { question: "How does investing work?", topic: "Investing Basics", answer: "Investing works by putting money into assets that have the potential to earn returns through growth, interest, or dividends." },
  { question: "What are stocks?", topic: "Investment Types", answer: "Stocks are shares of ownership in a company, giving investors a claim on profits and sometimes voting rights." },
  { question: "What are bonds?", topic: "Investment Types", answer: "Bonds are loans you give to governments or companies, which pay back with interest over a fixed period." },
  { question: "What are mutual funds?", topic: "Investment Types", answer: "Mutual funds pool money from many investors to buy a diversified portfolio of stocks, bonds, or other assets." },
  { question: "What are ETFs?", topic: "Investment Types", answer: "ETFs (Exchange-Traded Funds) are investment funds traded on stock exchanges, usually tracking an index or sector." },
  { question: "What is the stock market?", topic: "Investing Basics", answer: "The stock market is where investors buy and sell stocks, allowing companies to raise capital and investors to trade shares." },
  { question: "How do dividends work?", topic: "Investment Income", answer: "Dividends are payments a company makes to shareholders from its profits, usually paid quarterly." },
  { question: "What is risk in investing?", topic: "Investing Risks", answer: "Risk is the chance that an investment's value will decrease or fail to provide the expected return." },
  { question: "What is diversification?", topic: "Investing Strategies", answer: "Diversification is spreading investments across different assets to reduce risk and improve potential returns." },
  { question: "How much money do I need to invest?", topic: "Getting Started Investing", answer: "You can start investing with very small amounts; some platforms allow investing with just a few dollars." },
  { question: "What is long-term investing?", topic: "Investing Strategies", answer: "Long-term investing involves holding assets for several years to benefit from growth and compound returns." },
  { question: "What is short-term investing?", topic: "Investing Strategies", answer: "Short-term investing focuses on holding assets for a few months to a few years, often with higher risk and lower predictability." },
  { question: "What is compound interest?", topic: "Investing Growth", answer: "Compound interest is when investment earnings generate additional earnings over time, accelerating growth." },
  { question: "How do I start investing?", topic: "Getting Started Investing", answer: "Start by setting goals, opening a brokerage or investment account, and choosing investments that match your risk tolerance." },
  { question: "What is a brokerage account?", topic: "Investing Tools", answer: "A brokerage account is an account that lets you buy and sell investments like stocks, bonds, ETFs, and mutual funds." },
  { question: "What are index funds?", topic: "Investment Types", answer: "Index funds are mutual funds or ETFs designed to track the performance of a market index, like the S&P 500." },
  { question: "What are growth stocks?", topic: "Investment Types", answer: "Growth stocks are shares in companies expected to grow faster than the market, often reinvesting profits rather than paying dividends." },
  { question: "What are value stocks?", topic: "Investment Types", answer: "Value stocks are shares in companies considered undervalued based on fundamentals, often paying dividends." },
  { question: "What are common investing mistakes?", topic: "Investing Pitfalls", answer: "Common mistakes include trying to time the market, not diversifying, overtrading, and ignoring fees or risk tolerance." },

  // ===== 4. Taxes =====
  { question: "What are taxes?", topic: "Tax Basics", answer: "Taxes are compulsory financial charges imposed by governments on income, property, goods, or services." },
  { question: "What is income tax?", topic: "Income Taxes", answer: "Income tax is a tax imposed on an individual's earnings, typically based on income level and filing status." },
  { question: "What is a tax bracket?", topic: "Tax Rates", answer: "A tax bracket is a range of income that is taxed at a particular rate, usually structured progressively." },
  { question: "What are tax deductions?", topic: "Tax Reductions", answer: "Tax deductions reduce taxable income, lowering the amount of tax owed. Examples include student loan interest or mortgage interest." },
  { question: "What are tax credits?", topic: "Tax Reductions", answer: "Tax credits directly reduce the amount of tax owed and can be either refundable or non-refundable." },
  { question: "What is a W-2?", topic: "Tax Forms", answer: "A W-2 is a tax form provided by employers, reporting employees' annual wages and the taxes withheld from their paycheck." },
  { question: "What is a 1099?", topic: "Tax Forms", answer: "A 1099 is a tax form used to report income earned from sources other than an employer, like freelance work or interest income." },
  { question: "What is the difference between a tax deduction and a tax credit?", topic: "Tax Reductions", answer: "Deductions reduce your taxable income, while credits reduce the actual tax owed." },
  { question: "What is capital gains tax?", topic: "Investment Taxes", answer: "Capital gains tax is the tax on profits from the sale of assets like stocks, real estate, or other investments." },
  { question: "What is the standard deduction?", topic: "Tax Deductions", answer: "The standard deduction is a set amount of income that is not taxed, which reduces your taxable income." },
  { question: "What are itemized deductions?", topic: "Tax Deductions", answer: "Itemized deductions allow you to deduct specific expenses such as mortgage interest, medical costs, or charitable contributions." },
  { question: "What is the IRS?", topic: "Tax Authorities", answer: "The IRS (Internal Revenue Service) is the U.S. government agency responsible for collecting taxes and enforcing tax laws." },
  { question: "How can I reduce my taxable income?", topic: "Tax Strategies", answer: "Maximize deductions, contribute to tax-advantaged accounts (like IRAs or 401(k)s), and explore credits like the Child Tax Credit." },
  { question: "What is a tax refund?", topic: "Tax Filing", answer: "A tax refund is the amount of tax you paid in excess during the year, refunded after filing your tax return." },
  { question: "How do I file taxes?", topic: "Tax Filing", answer: "You can file taxes online using software, hire a professional, or fill out paper forms, depending on your complexity." },
  { question: "What is the deadline for filing taxes?", topic: "Tax Deadlines", answer: "The IRS tax filing deadline is typically April 15th, though it may be extended in certain circumstances." },

  // ===== 5. Loans & Credit =====
  { question: "What is credit?", topic: "Credit Basics", answer: "Credit is the ability to borrow money or access goods and services with the promise to pay later." },
  { question: "What is a credit score?", topic: "Credit Scores", answer: "A credit score is a numerical representation of your creditworthiness, typically ranging from 300 to 850." },
  { question: "What factors affect my credit score?", topic: "Credit Factors", answer: "Credit scores are affected by payment history, credit utilization, length of credit history, types of credit used, and recent inquiries." },
  { question: "What is a credit report?", topic: "Credit Reports", answer: "A credit report is a detailed record of your credit history, including accounts, balances, and payment history." },
  { question: "How do I check my credit score?", topic: "Credit Monitoring", answer: "You can check your credit score for free through major credit bureaus or through various online services." },
  { question: "What is a credit card?", topic: "Credit Cards", answer: "A credit card allows you to borrow money up to a limit to make purchases, which you must pay back with interest if not paid in full." },
  { question: "What is APR?", topic: "Credit Cards", answer: "APR (Annual Percentage Rate) is the interest rate charged on outstanding credit card balances or loans." },
  { question: "What is a secured credit card?", topic: "Credit Cards", answer: "A secured credit card requires a deposit as collateral, which becomes your credit limit, helping you build credit." },
  { question: "What is the difference between a credit card and a debit card?", topic: "Credit vs Debit", answer: "A credit card borrows money, while a debit card uses your own funds directly from your bank account." },
  { question: "What is a loan?", topic: "Loans Basics", answer: "A loan is borrowed money that must be repaid with interest, usually over a fixed period." },
  { question: "What is the difference between a personal loan and a payday loan?", topic: "Loans Types", answer: "Personal loans are long-term and have lower interest rates, while payday loans are short-term and have much higher interest rates." },
  { question: "What is an auto loan?", topic: "Loans Types", answer: "An auto loan is a type of secured loan used to finance the purchase of a vehicle, where the car serves as collateral." },
  { question: "What is a mortgage?", topic: "Loans Types", answer: "A mortgage is a loan used to purchase property, where the property itself acts as collateral." },
  { question: "How can I improve my credit score?", topic: "Credit Tips", answer: "Pay bills on time, reduce credit card balances, avoid unnecessary inquiries, and correct errors on your credit report." },
  { question: "What is a debt-to-income ratio?", topic: "Credit Metrics", answer: "Your debt-to-income ratio compares your monthly debt payments to your monthly income, and helps lenders assess credit risk." },
  
  // ===== 6. Banking =====
  { question: "What is a bank?", "topic": "Bank Account Basics", "answer": "A bank is a financial institution that accepts deposits, offers loans, and provides other financial services." },
  { question: "What is a checking account?", "topic": "Bank Account Basics", "answer": "A checking account is a bank account used for daily transactions like deposits, withdrawals, and payments." },
  { question: "What is a savings account?", "topic": "Bank Account Basics", "answer": "A savings account is a bank account that earns interest on deposited funds while keeping money safe." },
  { question: "How do I open a bank account?", "topic": "Bank Account Basics", "answer": "To open a bank account, provide personal identification, choose the account type, and deposit initial funds." },
  { question: "How do I close a bank account?", "topic": "Bank Account Basics", "answer": "To close a bank account, withdraw remaining funds, notify the bank, and ensure all pending transactions are cleared." }, 
  { question: "What is online banking?", "topic": "Banking Services", "answer": "Online banking allows you to manage your bank accounts, pay bills, and transfer money through the internet." },
  { question: "What is mobile banking?", "topic": "Banking Services", "answer": "Mobile banking is accessing your bank accounts and services via a smartphone app." },
  { question: "What is a debit card?", "topic": "Banking Services", "answer": "A debit card allows you to make purchases or withdraw cash directly from your checking account." },
  { question: "What is a wire transfer?", "topic": "Banking Services", "answer": "A wire transfer is an electronic transfer of funds from one bank account to another, often domestically or internationally." },
  { question: "What is an ATM?", "topic": "Banking Services", "answer": "An ATM (Automated Teller Machine) lets you withdraw, deposit, or transfer money without visiting a bank branch." },
  { question: "What is direct deposit?", "topic": "Banking Services", "answer": "Direct deposit is when funds, like a paycheck, are electronically transferred directly into your bank account." },
  { question: "What is mobile check deposit?", "topic": "Banking Services", "answer": "Mobile check deposit allows you to deposit checks by taking a photo with your smartphone banking app." },
  { question: "What is a bank fee?", "topic": "Banking Fees & Charges", "answer": "Bank fees are charges for services like account maintenance, overdrafts, or wire transfers." },
  { question: "What is overdraft?", "topic": "Banking Fees & Charges", "answer": "Overdraft occurs when you spend more money than you have in your account, sometimes incurring fees." },
  { question: "What is FDIC insurance?", "topic": "Account Protection & Security", "answer": "FDIC insurance protects deposits in member banks up to a certain limit if the bank fails." },
  { question: "How do I protect my bank account?", "topic": "Account Protection & Security", "answer": "Protect your bank account by using strong passwords, monitoring statements, and enabling two-factor authentication." },
  { question: "What is a bank statement?", "topic": "Bank Account Management", "answer": "A bank statement is a summary of all transactions in an account over a specific period." },
  { question: "What are common banking mistakes?", "topic": "Bank Account Management", "answer": "Common mistakes include overdrawing accounts, neglecting fees, not tracking spending, and failing to reconcile statements." },

  // ===== 7. Insurance =====
{ question: "What is insurance?", topic: "insurance", answer: "Insurance is a contract that protects you from financial loss by transferring risk to an insurance company." },
  { question: "What is health insurance?", topic: "insurance", answer: "Health insurance covers medical expenses such as doctor visits, hospital stays, and prescription medications." },
  { question: "What is life insurance?", topic: "insurance", answer: "Life insurance provides a payment to your beneficiaries upon your death to help cover expenses or financial needs." },
  { question: "What is auto insurance?", topic: "insurance", answer: "Auto insurance protects you financially in case of car accidents, theft, or damage to your vehicle." },
  { question: "What is home insurance?", topic: "insurance", answer: "Home insurance covers damage or loss to your house and possessions from events like fire, theft, or natural disasters." },
  { question: "What is renter’s insurance?", topic: "insurance", answer: "Renter’s insurance protects your personal belongings and may cover liability if someone is injured in your rented home." },
  { question: "What is disability insurance?", topic: "insurance", answer: "Disability insurance provides income if you are unable to work due to illness or injury." },
  { question: "What is travel insurance?", topic: "insurance", answer: "Travel insurance covers unexpected events while traveling, like trip cancellations, medical emergencies, or lost luggage." },
  { question: "What is pet insurance?", topic: "insurance", answer: "Pet insurance helps cover veterinary bills for accidents, illnesses, or routine care for your pets." },
  { question: "What is liability insurance?", topic: "insurance", answer: "Liability insurance protects you if you are legally responsible for injuries or damages to others." },
  { question: "What is an insurance premium?", topic: "insurance", answer: "An insurance premium is the amount you pay regularly to maintain your insurance coverage." },
  { question: "What is an insurance deductible?", topic: "insurance", answer: "A deductible is the amount you pay out-of-pocket before your insurance coverage begins." },
  { question: "How does insurance work?", topic: "insurance", answer: "Insurance works by pooling risk among many policyholders so the insurer can cover losses when they occur." },
  { question: "How do I choose insurance?", topic: "insurance", answer: "Choose insurance by comparing coverage options, costs, policy limits, and the insurer’s reputation." },
  { question: "What is a claim?", topic: "insurance", answer: "A claim is a request you make to your insurance company to pay for a covered loss or event." },
  { question: "What is co-pay?", topic: "insurance", answer: "A co-pay is a fixed amount you pay for a covered service, like a doctor visit, while the insurance covers the rest." },
  { question: "What is coinsurance?", topic: "insurance", answer: "Coinsurance is the percentage of a covered expense you pay after meeting your deductible." },
  { question: "What is term life insurance?", topic: "insurance", answer: "Term life insurance provides coverage for a specific period, paying a death benefit if you pass away during that term." },
  { question: "What is whole life insurance?", topic: "insurance", answer: "Whole life insurance provides lifelong coverage and may include a cash value component that grows over time." },
  { question: "What are common insurance mistakes?", topic: "insurance", answer: "Common mistakes include underinsuring, not comparing policies, ignoring deductibles, and failing to review coverage regularly." },

  // ===== 8. Retirement =====
  { question: "What is insurance?", "topic": "Insurance Basics", "answer": "Insurance is a contract that protects you from financial loss by transferring risk to an insurance company." },
  { question: "How does insurance work?", "topic": "Insurance Basics", "answer": "Insurance works by pooling risk among many policyholders so the insurer can cover losses when they occur." },
  { question: "How do I choose insurance?", "topic": "Insurance Basics", "answer": "Choose insurance by comparing coverage options, costs, policy limits, and the insurer’s reputation." },
  { question: "What is health insurance?", "topic": "Types of Insurance", "answer": "Health insurance covers medical expenses such as doctor visits, hospital stays, and prescription medications." },
  { question: "What is life insurance?", "topic": "Types of Insurance", "answer": "Life insurance provides a payment to your beneficiaries upon your death to help cover expenses or financial needs." },
  { question: "What is auto insurance?", "topic": "Types of Insurance", "answer": "Auto insurance protects you financially in case of car accidents, theft, or damage to your vehicle." },
  { question: "What is home insurance?", "topic": "Types of Insurance", "answer": "Home insurance covers damage or loss to your house and possessions from events like fire, theft, or natural disasters." },
  { question: "What is renter’s insurance?", "topic": "Types of Insurance", "answer": "Renter’s insurance protects your personal belongings and may cover liability if someone is injured in your rented home." },
  { question: "What is disability insurance?", "topic": "Types of Insurance", "answer": "Disability insurance provides income if you are unable to work due to illness or injury." },
  { question: "What is travel insurance?", "topic": "Types of Insurance", "answer": "Travel insurance covers unexpected events while traveling, like trip cancellations, medical emergencies, or lost luggage." },
  { question: "What is pet insurance?", "topic": "Types of Insurance", "answer": "Pet insurance helps cover veterinary bills for accidents, illnesses, or routine care for your pets." },
  { question: "What is liability insurance?", "topic": "Types of Insurance", "answer": "Liability insurance protects you if you are legally responsible for injuries or damages to others." },
  { question: "What is term life insurance?", "topic": "Types of Insurance", "answer": "Term life insurance provides coverage for a specific period, paying a death benefit if you pass away during that term." },
  { question: "What is whole life insurance?", "topic": "Types of Insurance", "answer": "Whole life insurance provides lifelong coverage and may include a cash value component that grows over time." },
  { question: "What is an insurance premium?", "topic": "Insurance Terms", "answer": "An insurance premium is the amount you pay regularly to maintain your insurance coverage." },
  { question: "What is an insurance deductible?", "topic": "Insurance Terms", "answer": "A deductible is the amount you pay out-of-pocket before your insurance coverage begins." },
  { question: "What is co-pay?", "topic": "Insurance Terms", "answer": "A co-pay is a fixed amount you pay for a covered service, like a doctor visit, while the insurance covers the rest." },
  { question: "What is coinsurance?", "topic": "Insurance Terms", "answer": "Coinsurance is the percentage of a covered expense you pay after meeting your deductible." },
  { question: "What is a claim?", "topic": "Insurance Processes", "answer": "A claim is a request you make to your insurance company to pay for a covered loss or event." },
  { question: "What are common insurance mistakes?", "topic": "Insurance Tips", "answer": "Common mistakes include underinsuring, not comparing policies, ignoring deductibles, and failing to review coverage regularly." },

  // ===== 9. Personal Finance =====
  { question: "What is personal finance?", "topic": "Personal Finance Basics", "answer": "Personal finance involves managing your money, including income, expenses, savings, and investments." },
  { question: "Why is personal finance important?", "topic": "Personal Finance Basics", "answer": "It helps you achieve financial goals, avoid debt, and ensure long-term financial stability." },
  { question: "How do I manage my money?", "topic": "Personal Finance Basics", "answer": "Track income and expenses, create a budget, save regularly, and invest wisely to manage your money effectively." },
  { question: "What is financial planning?", "topic": "Personal Finance Basics", "answer": "Financial planning is setting goals, creating a strategy, and managing resources to meet short- and long-term financial needs." },
  { question: "What is net worth?", "topic": "Personal Finance Basics", "answer": "Net worth is the total value of your assets minus your liabilities, showing your overall financial health." },
  { question: "What is cash flow?", "topic": "Personal Finance Basics", "answer": "Cash flow is the movement of money in and out of your accounts, showing how much you have available for spending and saving." },
  { question: "What are financial goals?", "topic": "Personal Finance Goals", "answer": "Financial goals are specific targets like saving for a house, paying off debt, or building retirement funds." },
  { question: "How do I reduce debt?", "topic": "Personal Finance Goals", "answer": "Focus on paying high-interest debts first, create a repayment plan, and avoid taking on new debt." },
  { question: "What is financial literacy?", "topic": "Personal Finance Goals", "answer": "Financial literacy is understanding money management, budgeting, investing, and making informed financial decisions." },
  { question: "What is a financial emergency?", "topic": "Personal Finance Goals", "answer": "A financial emergency is an unexpected event requiring money, such as medical bills, car repairs, or job loss." },
  { question: "How do I track expenses?", "topic": "Personal Finance Tools", "answer": "Record all spending using apps, spreadsheets, or a notebook to understand where your money goes." },
  { question: "How do I plan for college?", "topic": "Personal Finance Tools", "answer": "Save in education-specific accounts like 529 plans, explore scholarships, and budget for tuition and living costs." },
  { question: "What is financial risk?", "topic": "Personal Finance Tools", "answer": "Financial risk is the chance of losing money on investments, savings, or unexpected expenses." },
  { question: "What is financial security?", "topic": "Personal Finance Tools", "answer": "Financial security is having enough resources to cover your needs and maintain stability during emergencies." },
  { question: "How do I save for a house?", "topic": "Personal Finance Strategies", "answer": "Create a dedicated savings plan, cut unnecessary expenses, and consider high-yield savings or investment accounts." },
  { question: "How do I save for retirement?", "topic": "Personal Finance Strategies", "answer": "Contribute regularly to retirement accounts like 401ks or IRAs, and invest for long-term growth." },
  { question: "How do I improve financial habits?", "topic": "Personal Finance Strategies", "answer": "Set budgets, track spending, avoid impulsive purchases, save consistently, and invest wisely." },
  { question: "What are common personal finance mistakes?", "topic": "Personal Finance Mistakes", "answer": "Common mistakes include overspending, not saving enough, ignoring debt, and failing to plan for emergencies." },
  { question: "How do I start budgeting?", "topic": "Personal Finance Actions", "answer": "List income and expenses, categorize spending, set limits, and adjust regularly to meet your financial goals." },
  { question: "How do I start investing?", "topic": "Personal Finance Actions", "answer": "Start by learning about investment options, opening an account, and investing gradually according to your risk tolerance." },
  
  // ===== 10. Cryptocurrency =====
  { question: "What is cryptocurrency?", "topic": "Crypto Basics", "answer": "Cryptocurrency is digital money that uses cryptography and blockchain technology to secure transactions." },
  { question: "What is Bitcoin?", "topic": "Crypto Basics", "answer": "Bitcoin is the first and most well-known cryptocurrency, often used as a digital store of value." },
  { question: "What is Ethereum?", "topic": "Crypto Basics", "answer": "Ethereum is a cryptocurrency and blockchain platform that supports smart contracts and decentralized applications." },
  { question: "What is blockchain?", "topic": "Crypto Basics", "answer": "Blockchain is a decentralized digital ledger that records transactions across many computers securely and transparently." },
  { question: "How do I buy cryptocurrency?", "topic": "Crypto Transactions", "answer": "You can buy cryptocurrency on exchanges using fiat money or other cryptocurrencies." },
  { question: "How do I store cryptocurrency?", "topic": "Crypto Transactions", "answer": "Cryptocurrency can be stored in digital wallets, which can be online, hardware, or paper wallets." },
  { question: "What is a crypto wallet?", "topic": "Crypto Transactions", "answer": "A crypto wallet is software or hardware that stores your private keys and allows you to send and receive crypto." },
  { question: "What is a crypto exchange?", "topic": "Crypto Transactions", "answer": "A crypto exchange is a platform where you can buy, sell, or trade cryptocurrencies." },
  { question: "What is crypto trading?", "topic": "Crypto Transactions", "answer": "Crypto trading is buying and selling cryptocurrencies to profit from price fluctuations." },
  { question: "What is mining?", "topic": "Crypto Technologies", "answer": "Mining is the process of validating transactions on a blockchain and earning new coins as a reward." },
  { question: "What is a token?", "topic": "Crypto Technologies", "answer": "A token is a digital asset built on an existing blockchain, representing value, rights, or utility." },
  { question: "What is a stablecoin?", "topic": "Crypto Technologies", "answer": "A stablecoin is a cryptocurrency designed to maintain a stable value by pegging it to assets like the US dollar." },
  { question: "What is DeFi?", "topic": "Crypto Technologies", "answer": "DeFi, or decentralized finance, provides financial services like lending and trading without traditional intermediaries." },
  { question: "What is NFT?", "topic": "Crypto Technologies", "answer": "An NFT is a non-fungible token, a unique digital asset representing ownership of art, collectibles, or other items." },
  { question: "What is crypto staking?", "topic": "Crypto Technologies", "answer": "Staking involves locking up cryptocurrency in a blockchain network to support operations and earn rewards." },
  { question: "What is crypto lending?", "topic": "Crypto Technologies", "answer": "Crypto lending lets you lend your cryptocurrency to earn interest or borrow crypto by using your assets as collateral." },
  { question: "What are altcoins?", "topic": "Crypto Terminology", "answer": "Altcoins are all cryptocurrencies other than Bitcoin, such as Ethereum, Ripple, or Cardano." },
  { question: "What is crypto volatility?", "topic": "Crypto Terminology", "answer": "Crypto volatility refers to the frequent and significant price fluctuations in cryptocurrency markets." },
  { question: "How do I protect my crypto?", "topic": "Crypto Security", "answer": "Use secure wallets, enable two-factor authentication, avoid sharing private keys, and stay cautious of scams." },
  { question: "What are common crypto mistakes?", "topic": "Crypto Security", "answer": "Common mistakes include investing without research, using insecure wallets, trading impulsively, and ignoring risk management." }
];


// ==================== Utilities ====================
function preprocess(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

// ==================== Auto-Complete Suggestions ====================
function showSuggestions() {
  const input = preprocess(document.getElementById('questionInput').value);
  const suggestionsDiv = document.getElementById('suggestions');
  suggestionsDiv.innerHTML = "";
  if (!input) return;

  const matches = financeQA
    .filter(q => q.question.toLowerCase().includes(input))
    .slice(0, 5);

  matches.forEach(match => {
    const div = document.createElement('div');
    div.innerHTML = match.question;
    div.onclick = () => {
      document.getElementById('questionInput').value = match.question;
      suggestionsDiv.innerHTML = "";
    };
    suggestionsDiv.appendChild(div);
  });
}

async function getAnswer() {
  const inputElement = document.getElementById('questionInput');
  const userInput = preprocess(inputElement.value);
  const answerText = document.getElementById('answerText');
  const suggestionsDiv = document.getElementById('suggestions');

  // Clear previous suggestions
  suggestionsDiv.innerHTML = "";

  if (!userInput) {
    answerText.innerHTML = "<strong>Please enter a question.</strong>";
    return;
  }

  // Find best match using includes for flexibility
  const exactMatch = financeQA.find(q => preprocess(q.question) === userInput);
  if (exactMatch) {
    answerText.innerHTML = `<strong>Topic: ${exactMatch.topic}</strong><br>${exactMatch.answer}`;
    return;
  }

  // If no exact match, suggest similar questions
  const similarQuestions = financeQA
    .filter(q => preprocess(q.question).includes(userInput))
    .slice(0, 3);

  if (similarQuestions.length > 0) {
    const suggestionText = similarQuestions
      .map((q, i) => `${i + 1}. ${q.question}`)
      .join("<br>");
    answerText.innerHTML = `Sorry, I couldn't find an exact match. Please choose an available question from below:<br>${suggestionText}`;
  } else {
    answerText.innerText = "Sorry, no similar questions found.";
  }
}
