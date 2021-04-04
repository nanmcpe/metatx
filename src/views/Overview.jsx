import React, { useState, useEffect, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Web3 from 'web3';
import { withStyles } from '@material-ui/core/styles';
import { Web3Context } from '../context/Web3Provider';
import { Grid } from '@material-ui/core';


const styles = (theme) => ({
    paper: {
        backgroundColor: '#ffffff',
        border: '2px solid #000',
        boxShadow: '$000000',
        padding: 20,
    },
    paperModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px',
    },
    tableBorder: { borderWidth: 1, border: '1px solid rgba(224, 224, 224, 1)' },
});



const Overview = (props) => {
    const [formMessage, setFormMessage] = useState('');
    const [error, setError] = useState(false);
    const [bouncerAddress, setBouncerAddress] = useState('');
    const [lastTx, setLastTx] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [data, setData] = useState('0x00');
    const [ether, setEther] = useState('0.0001');
    const [gasPrice, setGasPrice] = useState('10');
    const [reward, setReward] = useState('0');
    // const [token, setToken] = useState('0xb3edD0F56Ae71eDa58B9eEa82533Ef0b35d7ee0E');
    const [token, setToken] = useState('0x0000000000000000000000000000000000000000');
    const [sig, setSig] = useState('');
    const [message, setMessage] = useState('');
    const [nonce, setNonce] = useState('');
    const { currentAccount, bouncerContract, web3 } = useContext(Web3Context);
    const { classes } = props;



    useEffect(async () => {
        if (bouncerContract.methods) {
            // const index = await bouncerContract.methods
            //     .issueIndex()
            //     .call();
            //PriceasLimit('20');
            // this.props.ipfsSigs.broadcast(data);

        }
        if (bouncerContract.events) {
            // bouncerContract.events.Drawed({
            //     fromBlock: 0
            // })
            //     .on('connected', function (subscriptionId) {
            //         console.log(subscriptionId);
            //     })
            //     .on('data', function (event) {
            //         console.log(event); // same results as the optional callback above
            //     });
        }
    }, [lastTx, currentAccount]);

    const sign = async () => {
        try {
            console.log('currentAccount', currentAccount);
            console.log('bouncerContract', bouncerContract._address);

            let timestamp = Date.now();
            let message = "" + currentAccount + " trusts bouncer proxy " + bouncerContract._address + " at " + timestamp;
            console.log("sign", message);
            setMessage(message);
            let sig = await web3.eth.personal.sign(message, currentAccount);
            console.log("SIG", sig);
            setSig(sig);
            let data = JSON.stringify({
                address: bouncerContract._address,
                account: currentAccount,
                timestamp: timestamp,
                message: message,
                sig: sig
            });
            console.log("BROADCASTING", data);
        } catch (err) {
            console.error(err);
        }
    };

    const transact = async () => {
        try {
            console.log('currentAccount', currentAccount);
            console.log('data', data);
            console.log('bouncerContract', bouncerContract._address);
            const nonce = await bouncerContract.methods
                .nonce(currentAccount)
                .call();
            console.log('nonce', nonce);
            console.log("Current nonce for " + currentAccount + " is ", nonce);
            console.log('ether', ether);
            console.log('reward', reward);
            console.log('message', message);
            console.log('sig', sig);
            console.log('gasPrice', gasPrice);
            const body = JSON.stringify({
                message: message,
                sig: sig,
                gas: '500000',
                gasPrice: Web3.utils.toWei(gasPrice, 'gwei'),
                parts: [
                    bouncerContract._address, //proxyAddress
                    currentAccount, //signer
                    toAddress, //destination
                    Web3.utils.toWei(ether, 'ether'),//value
                    "0x00", //data
                    token, //rewardToken
                    Web3.utils.toWei(reward, 'ether'), //rewardAmount
                ]
            });
            console.log('body', body);
            const result = await (await fetch(`http://localhost:10001/tx`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            })).json();
            console.log('result', result);
        } catch (err) {
            console.error(err);
        }
    };

    const addBouncer = async () => {
        try {
            console.log('currentAccount', currentAccount);
            console.log('bouncerAddress', bouncerAddress);
            const tx = await bouncerContract.methods
                .updateWhitelist(bouncerAddress, true)
                .send({ from: currentAccount });
            setLastTx(tx);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div>
            <AppBar
                className={classes.searchBar}
                position='static'
                color='default'
                elevation={0}
            >
                <Toolbar>
                    <Grid container item justify='flex-start' xs={3}>
                        <Grid>
                            <h3>Home</h3>
                        </Grid>
                    </Grid>
                    <Grid container item justify='flex-end' xs={9}>

                    </Grid>
                </Toolbar>
            </AppBar>
            <br /><br />
            <Grid container alignContent="space-between">
                <Grid item md={3}></Grid>
                <Grid item md={6}>
                    <TextField id="filled-basic" label="bouncer address" variant="filled"
                        onChange={(e) => setBouncerAddress(e.target.value)}
                        type="text"
                        fullWidth
                        autoComplete="off"
                    />
                    <Button onClick={addBouncer} variant="contained" color="primary" size="large" fullWidth>Add bouncer</Button>
                    <br /><br />
                    <TextField id="filled-basic" label="Ether" variant="filled"
                        onChange={(e) => setEther(e.target.value)}
                        type="text"
                        fullWidth
                        value={ether}
                    />
                    <TextField id="filled-basic" label="To address" variant="filled"
                        onChange={(e) => setToAddress(e.target.value)}
                        type="text"
                        autoComplete="off"
                        fullWidth
                        value={toAddress}
                    />
                    <TextField id="filled-basic" label="Gas price (Gwei)" variant="filled"
                        onChange={(e) => setGasPrice(e.target.value)}
                        type="text"
                        value={gasPrice}
                        fullWidth
                    />
                    <TextField id="filled-basic" label="Reward" variant="filled"
                        onChange={(e) => setReward(e.target.value)}
                        type="text"
                        fullWidth
                        autoComplete="off"
                        value={reward}
                    />
                    <TextField id="filled-basic" label="of Token" variant="filled"
                        onChange={(e) => setToken(e.target.value)}
                        type="text"
                        value={token}
                        fullWidth
                    />
                    <Button onClick={sign} variant="contained" color="primary" size="large" fullWidth>Sign</Button>
                    <br /><br />
                    <TextField id="filled-basic" label="signature" variant="filled"
                        onChange={(e) => setData(e.target.value)}
                        type="text"
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        autoComplete="off"
                        value={sig}
                    />
                    <Button onClick={transact} variant="contained" color="primary" size="large" fullWidth>Transact</Button>
                </Grid>
                <Grid item md={3}></Grid>
            </Grid>
            {error ? <p>Message</p> : null}
        </div>
    );

};

export default withStyles(styles)(Overview);
