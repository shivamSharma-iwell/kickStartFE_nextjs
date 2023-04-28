import React from "react";
import styles from '../styles/styles.module.css'

const Taxes = (props) => {
    return (
        <table className={styles.taxTable}>
        <tbody className={styles.highlight}>
            {props.taxes && props.taxes.map((tax) => (
                <tr key={tax.taxID}>
                    <td><input className={`${styles.inputBox} ${styles.highlight}`} name="taxName" 
                    onChange={(event) => props.modifyTaxes("changeTax", event, tax.taxID)} value={tax.taxName} maxLength="25"/></td>
                    <td className={styles.alignCenter}>
                        <input className={`${styles.inputBox} ${styles.highlight} ${styles.taxPercentage}`} name="taxPercentage" 
                        onChange={(event) => props.modifyTaxes("changeTax", event, tax.taxID)} value={tax.taxPercentage} maxLength="10"/>
                        <span>%</span>
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
                <td className={styles.alignLeft} colSpan="2"><b><input className={styles.inputBox} name="totalWithTaxName" value={props.data.totalWithTaxName} onChange={(event)=>props.handleChange(event)}/></b></td>
                <td className={styles.alignRight}><b>{props.price.currencySymbol} {props.totalWithTax}</b></td>
            </tr>
        </tfoot>
    </table>
    )
}
export default Taxes;