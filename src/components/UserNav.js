import React,{Component} from 'react';
import classNames from 'classnames';
import {BrowserRouter as Router,Route,Redirect,Link,Switch} from 'react-router-dom';
import { AppBar, Drawer, Toolbar, IconButton, Typography, Divider, ListItem, ListItemIcon, ListItemText, List } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StoreMallIcon from '@material-ui/icons/StoreMallDirectory';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import GroupIcon from '@material-ui/icons/Group';
import HomeIcon from '@material-ui/icons/Home';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AuthService from '../service/AuthService';
import Home from './Home';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});


class UserNav extends Component{

    constructor(props){
        super(props);
        this.AuthService = new AuthService();
        this.logout=this.logout.bind(this);
        this.state = {open:false};
        this.menuItems=[
          {icon:<HomeIcon></HomeIcon>,link:'/'},
          {icon:<StoreMallIcon></StoreMallIcon>,link:'/stock'},
          {icon:<PaymentIcon></PaymentIcon>,link:'/sales'},
          {icon:<ShoppingCartIcon></ShoppingCartIcon>,link:'/purchases'},
          {icon:<GroupIcon></GroupIcon>,link:'/users'},
          {icon:<ShowChartIcon></ShowChartIcon>,link:'/reports'}];
    }

    render(){
     const { classes } = this.props;
     const { open } = this.state;
     const userType = this.AuthService.getUserAccess();
     const sections = (userType==='Administrador')?['Inicio','Almacen','Compras','Ventas','Accesos','Consultas']:
                        (userType==='Vendedor')?['Inicio','Ventas']:['Inicio','Almacen','Compras'];

     return(<Router>
        <div className={classes.root}>
            <CssBaseline/>
            <div style={{display:'block'}}>
            <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
            <Toolbar disableGutters={!this.state.open}>
            <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
            >
            <MenuIcon />
            </IconButton>
            <div style={{flexGrow: 1}}>
            <Typography variant="h6" color="inherit" noWrap>
            Sistema
            </Typography>
            </div>
            <IconButton onClick={this.logout} style={{color:'white'}}>
            <ExitToAppIcon/> Salir
            </IconButton>
            </Toolbar>
            </AppBar>
            <Drawer classes={{
                paper: classes.drawerPaper,
              }} className={classes.drawer} variant="persistent" anchor="left" open={this.state.open} onClose={this.handleDrawerClose}>
                <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon/>
                </IconButton>
                </div>
                <Divider/>
                <List>
                {sections.map((text,index)=>
                    (
                        <Link to={this.menuItems[index].link} style={{textDecoration:'none'}} key={text+'_link'}>
                            <ListItem button key={text}>
                                <ListItemIcon>{this.menuItems[index].icon}</ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItem>
                        </Link>
                    )
                )}
                </List>
                </Drawer>
            
            </div>
            <main className={classNames(classes.content, {
                [classes.contentShift]: open,
              })}>
              <div className={classes.drawerHeader} />
              <Switch>
                <Route path='/' exact render={routerProps=> <Home {...routerProps} proname={'p'}/>}></Route>
                <Redirect from="*" to="/"/>
              </Switch>
            </main>        
        </div>
      </Router>
      );
    }


    handleDrawerOpen = () => {
        this.setState({ open: true });
    };
    
    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    logout(){
      this.AuthService.logout();
      this.props.onAuthChange();
    }

}

export default  withStyles(styles, { withTheme: true })(UserNav);