import Head from 'next/head'
import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import styles from '../styles/styles.module.css'
import Items from '../components/items'
import Taxes from '../components/taxes'
import moment from 'moment'

export default function Index() {

  const [currFocus, setCurrFocus] = useState(false);

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

  const [address, setAddress] = useState({
    addressLine1: '123 your street',
    addressLine2: 'Your Town',
    addressLine3: 'Address Line 3'
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

  const currentDate = moment().format('ll')

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


  const [data, setData] = useState({
    advisoryCompanyName: 'Company Name',
    contactNo: '123456789',
    email: 'youremail@gmail.com',
    invoiceHeading: 'Invoice',
    date: currentDate,
    invoiceID: 'Invoice #234556',
    poNumber: 'PO 123445',
    clientName: 'Mr. Jane Doe',
    clientCompanyName: 'Client Company Name',
    userMessage: 'Dear Ms. Jane Doe\n\nPlease find below a cost-breakdown for the recent work completed. Please make payment at your earliest convenience, and do not hesitate to contact me with any questions\n\nMany thanks,\nYour Name\n',
    subTotalName: 'Sub Total',
    totalWithTaxName: 'Total',
    conclusionMessage: 'Many thanks! I look forward to doing business with you again in due course.\n\nPayment terms: to be received within 60 days.\n'
  })

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(prevVal=>{
        return {
            ...prevVal,
            [name]: value
        }
    })
  }

  const handleChangeAddress = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAddress((prevValue)=>{
        return {
            ...prevValue,
            [name]: value
        }
    })
  }

  const evalAddress = () => {
    let currAddress = '';
    if(address.addressLine1.length!=0){
        currAddress = address.addressLine1 + '\n';
    }
    if(address.addressLine2.length!=0){
        currAddress += address.addressLine2 + '\n';
    }
    if(address.addressLine3.length!=0){
        currAddress += address.addressLine3;
    }
    return currAddress;
  }

  const handleDivClick = (name) => {
    setCurrFocus(name);
  }

  const handleInputBlur = () => {
    setCurrFocus(false);
  }

  const downloadPdf = () => {

      const totalData = {
        ...data,
        items: items,
        taxes: taxes,
        unitPriceName: price.unitPriceName,
        currencySymbol: price.currencySymbol,
        subTotal: subTotal,
        totalWithTax: totalWithTax,
        address: evalAddress()
      }

      let dataString = (JSON.stringify(totalData)).replaceAll("#", "hashSymbol")
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
                    <div className={styles.headerInfoBox}>
                        <div className={styles.companyName}>
                        {
                            currFocus=="advisoryCompanyName"?
                            <input className={`${styles.heading} ${styles.inputBox}`} name="advisoryCompanyName" 
                            value={data.advisoryCompanyName} onChange={(event)=>handleChange(event)} maxLength="50"
                            onBlur={()=>handleInputBlur()} autoFocus/>:
                            <div className={styles.heading} onClick={()=>handleDivClick("advisoryCompanyName")}>
                            {data.advisoryCompanyName}</div>
                         }
                        </div>
                        <div className={styles.invoiceHeading}>
                        {
                            currFocus=="invoiceHeading"?
                            <input className={`${styles.heading} ${styles.alignRight} ${styles.inputBox}`} 
                            name="invoiceHeading" value={data.invoiceHeading} onChange={(event)=>handleChange(event)} maxLength="30"
                            onBlur={()=>handleInputBlur()} autoFocus/>:
                            <div className={`${styles.heading} ${styles.alignRight}`} onClick={()=>handleDivClick("invoiceHeading")}>{data.invoiceHeading}</div>
                        }
                        </div>
                    </div>
                    <div className={styles.headerInfoBox}>
                        <div>
                            {
                                currFocus=="addressLine1"?
                                <input className={styles.inputBox} name="addressLine1" 
                                onChange={(event)=>handleChangeAddress(event)} value={address.addressLine1} maxLength="40"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div onClick={()=>handleDivClick("addressLine1")}>{address.addressLine1}</div>
                            }
                            {
                                currFocus=="addressLine2"?
                                <input className={styles.inputBox} name="addressLine2" 
                                onChange={(event)=>handleChangeAddress(event)} value={address.addressLine2} maxLength="40"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div onClick={()=>handleDivClick("addressLine2")}>{address.addressLine2}</div>
                            }
                            {
                                currFocus=="addressLine3"?
                                <input className={styles.inputBox} name="addressLine3" 
                                onChange={(event)=>handleChangeAddress(event)} value={address.addressLine3} maxLength="40"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div onClick={()=>handleDivClick("addressLine3")}>{address.addressLine3}</div>
                            }
                        </div>

                        <div>
                          {
                            currFocus=="date"?
                            <input className={`${styles.inputBox} ${styles.alignRight}`} 
                            name="date" value={data.date} onChange={(event)=>handleChange(event)} maxLength="25"
                            onBlur={()=>handleInputBlur()} autoFocus/>:
                            <div className={styles.alignRight} onClick={()=>handleDivClick("date")}>{data.date}</div>
                        }
                        {
                            currFocus=="invoiceID"?
                            <input className={`${styles.inputBox} ${styles.alignRight}`} 
                            name="invoiceID" value={data.invoiceID} onChange={(event)=>handleChange(event)} maxLength="25"
                            onBlur={()=>handleInputBlur()} autoFocus/>:
                            <div className={styles.alignRight} onClick={()=>handleDivClick('invoiceID')}>{data.invoiceID}</div>
                        }
                        {
                            currFocus=="poNumber"?
                            <input className={`${styles.inputBox} ${styles.alignRight}`} 
                            name="poNumber" value={data.poNumber} onChange={(event)=>handleChange(event)} maxLength="25"
                            onBlur={()=>handleInputBlur()} autoFocus/>:
                            <div className={styles.alignRight} onClick={()=>handleDivClick("poNumber")}>{data.poNumber}</div>
                        }  
                        </div>
                    </div>
                    <div className={styles.headerInfoBox}>
                        <div>
                            {
                                currFocus=="contactNo"?
                                <input className={styles.inputBox} name="contactNo" value={data.contactNo} 
                                onChange={(event)=>handleChange(event)} maxLength="25"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div onClick={()=>handleDivClick("contactNo")}>{data.contactNo}</div>
                            }
                            {
                                currFocus=="email"?
                                <input className={styles.inputBox} name="email" value={data.email} 
                                onChange={(event)=>handleChange(event)} maxLength="50"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div onClick={()=>handleDivClick("email")}>{data.email}</div>
                            }
                        </div>
                        <div className={styles.highlight}>
                            {
                                currFocus=="clientName"?
                                <input className={`${styles.inputBox} ${styles.alignRight} ${styles.highlight}`} 
                                name="clientName" value={data.clientName} onChange={(event)=>handleChange(event)} maxLength="30"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div className={styles.alignRight} onClick={()=>handleDivClick("clientName")}>{data.clientName}</div>
                            }
                            {
                                currFocus=="clientCompanyName"?
                                <input className={`${styles.inputBox} ${styles.alignRight} ${styles.highlight}`} 
                                name="clientCompanyName" value={data.clientCompanyName} onChange={(event)=>handleChange(event)} maxLength="50"
                                onBlur={()=>handleInputBlur()} autoFocus/>:
                                <div className={styles.alignRight} onClick={()=>handleDivClick("clientCompanyName")}>{data.clientCompanyName}</div>
                            }
                        </div>
                    </div>   
                  </div>
                  <hr/>
                    {
                        currFocus=="userMessage"?
                        <textarea className={`${styles.userMessageTextArea} ${styles.textAreaBox}`} 
                        name="userMessage" value={data.userMessage} onChange={(event)=>handleChange(event)} maxLength="350"
                        onBlur={()=>handleInputBlur()} autoFocus/>:
                        <div className={styles.userMessageDiv} onClick={()=>handleDivClick("userMessage") }>{data.userMessage}</div>
                    }
                  <Items 
                      items={items}
                      taxes={taxes}
                      modifyItems={modifyItems}
                      modifyTaxes={modifyTaxes}
                      subTotal={subTotal}
                      totalWithTax={totalWithTax}
                      price={price}
                      handlePriceChange={handlePriceChange}
                      data={data}
                      handleChange={handleChange}
                      currFocus={currFocus}
                      handleDivClick={handleDivClick}
                      handleInputBlur={handleInputBlur}
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
                      data={data}
                      handleChange={handleChange}
                      currFocus={currFocus}
                      handleDivClick={handleDivClick}
                      handleInputBlur={handleInputBlur}
                  />
                  {
                    currFocus=="conclusionMessage"?
                    <textarea className={`${styles.conclusionMessageTextArea} ${styles.textAreaBox}`} 
                    name="conclusionMessage" value={data.conclusionMessage} onChange={(event)=>handleChange(event)} maxLength="200"
                    onBlur={()=>handleInputBlur()} autoFocus/>:
                    <div className={styles.conclusionMessageDiv} 
                    onClick={()=>handleDivClick("conclusionMessage") }>{data.conclusionMessage}</div>
                  }
              </div>     
              <div className={styles.rightMainBox}>
                  <button className={styles.rightBoxDownloadBtn} onClick={() => downloadPdf()}>Download this invoice</button>
              </div>
          </div>
      </div>
    </>
  )
}   