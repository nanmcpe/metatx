import React, { useState, useContext } from 'react';
import { Web3Context } from './context/Web3Provider';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';  //exporting context object
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import Overview from './views/Overview';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

const connectWallet = async () => {
  console.log('click');
};

const style = {
  backgroundColor: "#F8F8F8",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  paddingTop: "20px",
  paddingBottom: "20px",
  // position: "fixed",
  marginTop: 40,
  left: "0",
  bottom: "0",
  width: "100%",
};


const Content = (props) => {
  const { classes } = props;
  const { currentAccount, messageContract } = useContext(Web3Context);

  return (
    <React.Fragment>
      <BrowserRouter>
        <AppBar
          component="div"
          className={classes.secondaryBar}
          color="primary"
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="flex-start"
            >
              <Grid item md={3}>
                <Grid container>
                  <Grid item>
                    {/* <Avatar alt="Logo" variant="rounded" style={{ width: 100 }} src={window.location.origin + '/GLO36.jpg'} /> */}
                  </Grid>
                  <Grid item>
                    <Typography color="inherit" style={{ fontSize: 25, marginLeft: 20, alignItems: 'center' }}>META TX</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={7}
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                space={1}
              >
              </Grid>
              <Grid item md={2}
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid item>
                  <Button variant="contained"
                    style={{
                      backgroundColor: '#ff5722',
                      color: '#ffffff'
                    }}
                    onClick={connectWallet}
                  >
                    {currentAccount.substr(0, 6) + '...' + currentAccount.substr(-6)}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Route exact path="/">
          <Overview />
        </Route>
      </BrowserRouter>
      <div style={style}>
        Meta Transaction on BSC Testnet
        </div>
    </React.Fragment >
  );
};

export default withStyles(styles)(Content);
