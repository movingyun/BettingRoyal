import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import styles from "./Vault.module.css";

export default function Vault() {
  const [vaultmoney, setVaultmoney] = useState();
  const [deposit, setDeposit] = useState();
  const [withdrawamount, setWithdrawamount] = useState();
  const [depositstatus, setDepositstatus] = useState("");
  const [withdrawstatus, setWithdrawstatus] = useState("");
  const [ruby, setRuby] = useState();

  useEffect(() => {
    axios
      .get("/api/vault", {
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",

        },
      })
      .then((response) => {
        console.log("vault balance = " + response.data);
        setVaultmoney(response.data);
      })
      .catch((error) => {
        console.log(error);
      });


    axios
    .get("/api/user", { 
        headers: {
          Authorization: window.localStorage.accessToken,
          "Content-Type": "application/json",

        },
      })
      .then((response) => {
        console.log("ruby balance = " + JSON.stringify(response.data.userRuby));
        setRuby(response.data.userRuby);

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function Deposit() {
    console.log("입금", deposit);
    axios
      .put("/api/vault/update",  {deposit:deposit},{
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: window.localStorage.accessToken,
        },
      })
      .then((response) => {
        console.log("vault balance = " + response.data.userVault);
        setRuby(response.data.userRuby);
        setVaultmoney(response.data.userVault);
        setDepositstatus(deposit + "루비 입금 완료");
      })
      .catch((error) => {
        if (error.response.data.error == 10) {console.log("보유량 초과");
        setDepositstatus("보유량 초과")}

      });
  }

  function Withdraw() {
    console.log("출금" + withdrawamount);
    axios
      .put("/api/vault/update", {deposit:withdrawamount* -1} , {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: window.localStorage.accessToken,
        },
      })
      .then((response) => {
        console.log("vault balance = " + response.data.userVault);
        setRuby(response.data.userRuby);
        setVaultmoney(response.data.userVault);
        setWithdrawstatus(withdrawamount + "루비 출금 완료");
      })
      .catch((error) => {
        if (error.response.data.error == 20) {
          console.log("금고량 초과");
          setWithdrawstatus("금고 보유량 초과");
        }
      });
  }

  return (
    <div>
      <p className={styles.bg}> <div className={styles.tite}>현재 보유 루비 : {ruby}</div></p>
      <p className={styles.bg}>현재 금고 잔액 : {vaultmoney}</p>
      <div className={styles.contents}>
        <TextField
          className={styles.field}
          color="action"
          onChange={(e) => {
            setDeposit(e.target.value);
          }}
          autoFocus
          placeholder="입금할 금액을 입력하세요."
        ></TextField>
        <button onClick={Deposit} className={styles.btn}>입금</button>
        <p className={styles.read}>{depositstatus}</p>
        <TextField
          className={styles.field}
          color="action"
          onChange={(e) => {
            setWithdrawamount(e.target.value);
          }}
          placeholder="출금할 금액을 입력하세요."
        ></TextField>
        <button onClick={Withdraw} className={styles.btn}>출금</button>
        <p className={styles.read}>{withdrawstatus}</p>
      </div>
    </div>
  );
}
