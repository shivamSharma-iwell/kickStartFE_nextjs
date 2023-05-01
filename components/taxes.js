import React from "react";
import styles from '../styles/styles.module.css'

const Taxes = (props) => {
    return (
        <table className={styles.taxTable}>
        <tbody className={styles.highlight}>
            {props.taxes && props.taxes.map((tax) => (
                <tr key={tax.taxID}>
                    <td>
                        {
                            props.currFocus==`${tax.taxID} taxName`?
                            <input className={`${styles.inputBox} ${styles.highlight}`} name="taxName" 
                            onChange={(event) => props.modifyTaxes("changeTax", event, tax.taxID)} 
                            value={tax.taxName} maxLength="40" onBlur={()=>props.handleInputBlur()} autoFocus/>:
                            <div onClick={()=>props.handleDivClick(`${tax.taxID} taxName`)}>{tax.taxName}</div>
                        }
                        
                    </td>


                    <td>

                    {
                            props.currFocus==`${tax.taxID} taxPercentage`?
                            <>
                            <input className={`${styles.highlight} ${styles.taxPercentage}`} name="taxPercentage" 
                            onChange={(event) => props.modifyTaxes("changeTax", event, tax.taxID)}  
                
                            value={tax.taxPercentage} maxLength="25" onBlur={()=>props.handleInputBlur()} autoFocus/>
                            <span>%</span>
                            </>:
                            <>
                            <div className={styles.alignCenter}  onClick={()=>props.handleDivClick(`${tax.taxID} taxPercentage`)}>{tax.taxPercentage} %</div>
                    
                            </>
                        }

                        
                    </td>
                    <td className={`${styles.highlight} ${styles.alignRight}`} name="taxAmount">{
                        props.price.currencySymbol} {tax.taxAmount}
                        <button className={`${styles.btn} ${styles.remove}`} onClick={(event) => props.modifyTaxes("deleteTax", event, tax.taxID)}>&#x2715;</button>
                    </td>      
                </tr>
            ))}
        </tbody>
        <tfoot className={`${styles.taxesTotal} ${styles.highlight}`}>
            <tr>
                <td colSpan="3">
                    <button className={`${styles.btn} ${styles.addNewEntity}`} onClick={() => props.modifyTaxes("addTax")}>+ Add tax</button>
                </td>   
             </tr>
            <tr>
                <td className={styles.alignLeft} colSpan="2">
                    {
                        props.currFocus=="totalWithTaxName"?
                        <input className={`${styles.inputBox} ${styles.highlight}`} type="text" 
                        name="totalWithTaxName" value={props.data.totalWithTaxName} onChange={(event)=>props.handleChange(event)}
                        onBlur={()=>props.handleInputBlur()}/>:
                        <div  onClick={()=>props.handleDivClick("totalWithTaxName")}>{props.data.totalWithTaxName}</div>
                    }
                    
                    </td>
                <td className={styles.alignRight}><b>{props.price.currencySymbol} {props.totalWithTax}</b></td>
            </tr>
        </tfoot>
    </table>
    )
}
export default Taxes;