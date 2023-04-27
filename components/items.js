import React from "react";
import styles from '../styles/styles.module.css'

const Items = (props) => {
    return (
    <table className={styles.itemTable}>
        <thead className={styles.highlight}>
            <tr>
                <th className={styles.alignLeft}>#</th>
                <th className={styles.alignCenter}>Item Description</th>
                <th className={styles.alignCenter}>Quantity</th>
                <th className={styles.alignCenter}>
                    <input
                        className={`${styles.priceInput} ${styles.alignCenter} ${styles.inputBox}`}
                        type="text"
                        name="currencyName"
                        value={props.price.unitPriceName}
                        onChange={(event) => {props.handlePriceChange(event)}}
                    /> 
                </th>
                <th className={styles.alignRight}>Line Total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {props.items && props.items.map((item, index) => (
                <tr key={item.taxID}>
                    <td className={styles.alignLeft}>{index + 1}</td>
                    <td>
                        <input
                            className={`${styles.inputBox} ${styles.alignCenter}`}
                            type="text"
                            name="description"
                            value={item.description}
                            onChange={(event) => {props.modifyItems("changeItem", event, item.itemID)}}
                        />
                    </td>
                    <td>
                        <input
                            className={`${styles.inputBox} ${styles.alignCenter}`}
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(event) => {props.modifyItems("changeItem", event, item.itemID)}}
                        />
                    </td>
                    <td>
                        <input
                            className={`${styles.inputBox} ${styles.alignCenter}`}
                            type="number"
                            name="unitPrice"
                            value={item.unitPrice}
                            onChange={(event) => {props.modifyItems("changeItem", event, item.itemID)}}
                        />
                    </td>
                    <td className={`${styles.alignRight} ${styles.lineTotal}`} type="number" name="lineTotal">
                        {props.price.currencySymbol} {item.lineTotal}  
                    </td>
                    <td className={styles.alignRight}><button className={`${styles.btn} ${styles.remove}`} onClick={(event) => props.modifyItems("deleteItem", event, item.itemID)}>&#x2715;</button></td>
                </tr>
            ))}
        </tbody>

        <tfoot className={`${styles.itemsTotal} ${styles.highlight}`}>
            <tr>
                <td colSpan="6">
                    <button className={`${styles.btn} ${styles.addNewEntity}`} onClick={() => props.modifyItems("addItem")}>+ Add Item</button>
                </td>
            </tr>
        <tr>
            <td suppressContentEditableWarning={true} contentEditable="true" colSpan="4" ref={(text) => props.contentEditableRef.current.push(text)}><b>Sub Total</b></td>
            <td className={styles.alignRight} colSpan="2"><b>{props.price.currencySymbol} {props.subTotal}</b></td>
        </tr>
        </tfoot>
    </table>
    )
}

export default Items;