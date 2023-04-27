import Head from 'next/head'
import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import styles from '../styles/styles.module.css'
import Items from '../components/items'
import Taxes from '../components/taxes'

export default function Index() {
  const contentEditableRef = useRef([]);
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleString('en-us', { month: 'long' }); 
  const year = date.getFullYear();
  const currentDate = `${day} ${month} ${year}`;

  const [items, setItems] = useState([{
      itemID: uuid(),
      description: "item",
      quantity: 1,
      unitPrice: 100,
      lineTotal: 100
  }]);

  const [taxes, setTaxes] = useState([{
      taxID: uuid(),
      taxName: 'Tax Name',
      taxPercentage: 20,
      taxAmount: 20
  }])

  const [subTotal, setsubTotal] = useState(100)
  const [totalWithTax, setTotalWithTax] = useState(120)

  const [price, setPrice] = useState({
      unitPriceName: 'Unit price (₹)',
      currencySymbol: '₹'
  })

  useEffect(() => {
      const newSubTotal = items.reduce((accumulator, item) => accumulator + item.lineTotal, 0)
      setsubTotal(newSubTotal);
      setTaxes(taxes.map((tax) => {
          return { ...tax, taxAmount: Math.round((tax.taxPercentage * newSubTotal) / 100) }
      }))
  }, [items])


  useEffect(() => {
      const newTotalWithTax = taxes.reduce((accumulator, tax) => accumulator + tax.taxAmount, 0)
      setTotalWithTax(newTotalWithTax + subTotal);
  }, [items, taxes])


  const modifyItems = (eventName, event, currItemID) => {
      switch (eventName) {
          case "addItem":
              setItems((prev) => {
                  return [...prev, {
                      itemID: uuid(),
                      description: "item",
                      quantity: 1,
                      unitPrice: 100,
                      lineTotal: 100
                  }]
              })
              break;
          case "deleteItem":
              setItems(items.filter(item => item.itemID != currItemID))
              break;
          case "changeItem":
              const fieldName = event.target.name;
              const value = event.target.value;
              setItems(
                  items && items.map((item) => {
                      if (item.itemID == currItemID) {
                          if (fieldName == 'quantity' || fieldName == 'unitPrice') {
                              const otherFieldName = (fieldName == 'quantity') ? 'unitPrice' : 'quantity';
                              const newLineTotal = value * item[otherFieldName];
                              return { ...item, [fieldName]: value, ['lineTotal']: newLineTotal};
                          } else {
                              return { ...item, [fieldName]: value };
                          }
                      }
                      return item;
                  })
              );
              break;
          default:
              break;
      }
  }

  const modifyTaxes = (eventName, event, currTaxID) => {
      switch (eventName) {
          case "addTax":
              setTaxes((prev) => {
                  return [...prev, {
                      taxID: uuid(),
                      taxName: 'Tax Name',
                      taxPercentage: 20,
                      taxAmount: Math.round(subTotal * 0.2)
                  }]
              })
              break;
          case "deleteTax":
              setTaxes(taxes.filter(tax => tax.taxID != currTaxID))
              break;
          case "changeTax":
              const fieldName = event.target.name;
              const value = event.target.value
              setTaxes(
                 taxes &&  taxes.map((tax) => {
                      if (tax.taxID == currTaxID) {
                          if (fieldName == "taxPercentage") {
                              const newTaxAmount = Math.round(value * subTotal / 100);
                              return { ...tax, taxAmount: newTaxAmount, [fieldName]: value };
                          } else {
                              return { ...tax, [fieldName]: value };
                          }
                      }
                      return tax;
                  })
              );
              break;
          default:
              break;
      }
  }

  const handlePriceChange = (event) => {
      const value = event.target.value
      const openingBracket = value.indexOf('(');
      const closingBracket = value.indexOf(')');
      const currSymbol = openingBracket > -1 && closingBracket > -1 && openingBracket < closingBracket
          ? value.substring(openingBracket + 1, closingBracket)
          : '';
      setPrice({
          unitPriceName: value,
          currencySymbol: currSymbol
      })
  }

  const downloadPdf = () => {
      const data = {
          "advisoryCompanyName": contentEditableRef.current[0].innerText,
          "address": contentEditableRef.current[1].innerText,
          "contactNo": contentEditableRef.current[2].innerText,
          "email": contentEditableRef.current[3].innerText,
          "invoiceHeading": contentEditableRef.current[4].innerText,
          "date": contentEditableRef.current[5].innerText,
          "invoiceID": contentEditableRef.current[6].innerText,
          "poNumber": contentEditableRef.current[7].innerText,
          "clientName": contentEditableRef.current[8].innerText,
          "clientCompanyName": contentEditableRef.current[9].innerText,
          "userMessage": contentEditableRef.current[10].innerText,
          "items": items,
          "taxes": taxes,
          "unitPriceName": price.unitPriceName,
          "currencySymbol": price.currencySymbol,
          "subTotal": subTotal,
          "totalWithTax": totalWithTax,
          "subTotalName": contentEditableRef.current[11].innerText,
          "totalWithTaxName": contentEditableRef.current[12].innerText,
          "conclusionMessage": contentEditableRef.current[13].innerText,
      }

      let dataString = (JSON.stringify(data)).replaceAll("#", "hashSymbol")
      dataString = dataString.replaceAll("&", "ampersandSymbol")
      dataString = dataString.replaceAll("%", "percentageSymbol")
      dataString = dataString.replaceAll("+", "plusSymbol")
      window.open(`http://localhost:3000/downloadInvoice?data=${dataString}`)
  }

  return (
    <>
      <Head>
        <title>Tax Invoice Generator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.screenContainer}>
          <h2 className={styles.toolTitle}>Advisory Invoice Generator</h2>
          <div className={styles.mainContainer}>
              <div className={styles.leftMainBox}>
                  <div className={styles.headerInfo}>
                      <div className={styles.leftContainer}>
                          <div className={styles.heading} suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>Company Name</div>
                          <div ref={(text) => contentEditableRef.current.push(text)}>
                              <div suppressContentEditableWarning={true} contentEditable="true">123 your street</div>
                              <div suppressContentEditableWarning={true} contentEditable="true">Your town</div>
                              <div suppressContentEditableWarning={true} contentEditable="true">Address Line 3</div>
                          </div>
                          <div suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>(123) 456 789</div>
                          <div suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>email@yourcompany.com</div>
                      </div>
                      <div className={`${styles.rightContainer} ${styles.alignRight}`}>
                          <div className={styles.heading} suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>Invoice</div>
                          <div suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>{currentDate}</div>
                          <div suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>Invoice #2334889</div>
                          <div suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>PO 456001200</div>
                          <div suppressContentEditableWarning={true} className={styles.highlight} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>Att: Ms. Jane Doe</div>
                          <div suppressContentEditableWarning={true} className={styles.highlight} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>Client Company Name</div>
                      </div>
                  </div>
                  <hr/>
                  <div className={styles.userMessage} suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>
                      <span>Dear Ms. Jane Doe</span>
                      <br />
                      <br />
                      <span>Please find below a cost-breakdown for the recent work completed. Please make payment at your
                          earliest convenience, and do not hesitate to contact me with any questions.
                      </span>
                      <br />
                      <br />
                      <span>Many Thanks</span>
                      <br />
                      <span>Your Name</span>
                  </div>

                  <Items 
                      items={items}
                      taxes={taxes}
                      modifyItems={modifyItems}
                      modifyTaxes={modifyTaxes}
                      subTotal={subTotal}
                      totalWithTax={totalWithTax}
                      price={price}
                      handlePriceChange={handlePriceChange}
                      contentEditableRef={contentEditableRef}
                  />
                  <Taxes
                      items={items}
                      taxes={taxes}
                      modifyItems={modifyItems}
                      modifyTaxes={modifyTaxes}
                      subTotal={subTotal}
                      totalWithTax={totalWithTax}
                      price={price}
                      handlePriceChange={handlePriceChange}
                      contentEditableRef={contentEditableRef}
                  />
                  <div className={styles.conclusionMessage} suppressContentEditableWarning={true} contentEditable="true" ref={(text) => contentEditableRef.current.push(text)}>
                      <span>Many thanks! I look forward to doing business with you again in due course. </span>
                      <br />
                      <br />
                      <span> Payment terms: to be received within 60 days.</span>
                  </div>
              </div>     
              <div className={styles.rightMainBox}>
                  <button className={styles.rightBoxDownloadBtn} onClick={() => downloadPdf()}>Download this invoice</button>
              </div>
          </div>
      </div>
    </>
  )
}