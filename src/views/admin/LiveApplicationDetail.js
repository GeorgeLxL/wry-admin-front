import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBCard,
  MDBCardBody,
  MDBNavItem,
  MDBNavLink,
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBNavbarNav,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBModal,
  MDBModalBody,


} from 'mdbreact';

import SectionContainer from '../../components/sectionContainer';
import TextField from '@material-ui/core/TextField';
const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;
var axios = require('axios');
class Live_Application_detail extends Component {
  state = {
    activeItem: '1',
    editname : true,
    editcategory:true,
    edittopannouncement:true,
    edityoutubelive:true,
    editpaidcontend:true,
    editliveticket:true,
    editlivedateTime:true,
    editMemo:true,
    editperformers:true,
    AnnouncementImage:"",
    liveName : "",
    liveCategory:"0",
    livePaidAmount:"",
    liveperformers:"",
    livetopannouncement:false,
    liveyoutube:false,
    livepaidcontent:false,
    liveticket:false,
    liveTicketAmount:"",
    liveTicketMaxNum:0,
    liveDateAndTime:"",
    requestResultTitle:"",
    requestResultContent:"",
    live_shedule_data: {
      columns: [
        {
          field: 'Name',
        },
        {
          field: 'Content',
        },
        {
          field: 'Action',
        },
      ],
      rows:[],
    },
    artist_infor_data: {
      columns: [
        {
          field: 'Name',
        },
        {
          field: 'Content',
        },
        {
          field: 'Action',
        },
      ],
      rows:[],
    },
    sheduleRequest_modal:false,
    sheduleRequestResult_modal:false,
  };
  toggle = tab => e => {
    if (this.state.activeItem !== tab) {
      this.setState({
        activeItem: tab
      });
    }
  };

  togglemodal = modalName => e => {
    this.setState({
        [modalName]: !this.state[modalName]
      });
  };
  componentDidMount(){
    const {id} = this.props.match.params;
    this.getlivescheduledata(id);
  }

  
  getlivescheduledata(id)
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data1 = new Array();
    var data2 = new Array();
    var config = {
        method: 'get',
        url: `${apiurl}/live/` + id,
        headers: { 
        'Authorization': 'Bearer ' + token,
    },
        data : {},
    };
    axios(config)
    .then((response) => {   
          
        var responsedata = response.data.live;
        var artistData = responsedata.Artist;
        var sheduleData = responsedata.Schedule;
        console.log(response);
        var temp = {};          
        temp.Name = "ID";
        temp.Content = artistData.id;
        temp.Action = "";
        data1.push(temp);
        var temp = {};
        temp.Name = "Name";
        temp.Content = artistData.username;
        temp.Action = ""
        data1.push(temp);
        var temp = {};
        temp.Name = "Email";
        temp.Content = artistData.email;
        temp.Action = "";
        data1.push(temp);
        var temp = {};
        temp.Name = "Registration Date";
        temp.Content = artistData.registeredDate;
        temp.Action = "";
        data1.push(temp);
        var temp = {};
        temp.Name = "Last Update Date";
        temp.Content = artistData.dateUpdated;
        temp.Action = "";
        data1.push(temp);
        var temp = {};
        temp.Name = "Profile URL";
        temp.Content = <a href={artistData.profileUrl}>{artistData.profileUrl}</a>;
        temp.Action = "";
        data1.push(temp);
        var temp = {};
        temp.Name = "Status";
        temp.Content = artistData.status;
        temp.Action = "";
        data1.push(temp);
        var artist_infor_data = this.state.artist_infor_data;
        artist_infor_data.rows = data1;
        this.setState({
          artist_infor_data:artist_infor_data
        });
      
        var temp = {};
        temp.Name = "ID";
        temp.Content = sheduleData.id;
        temp.Action = "";
        data2.push(temp)
       
        var temp = {};
        temp.Name = "Application Status";
        temp.Content = sheduleData.applicationStatus;
        temp.Action = ""
        data2.push(temp);
        var category={"EDM":1,"HipHop":2,"House":3,"Techno":4,"Trance":5};
        var time = sheduleData.liveDateAndTime.replace(/\(|\)|/gi, "").replace(" ","T").replace(/\//gi,"-");
        var performernames="";
        var performer = sheduleData.performer;
        
        if(performer){
          performer.forEach(name=>{
            performernames+=name.name;
            performernames+=",";
          })
          performernames = performernames.slice(0, -1);
        }
        this.setState({
          liveName:sheduleData.liveName,
          liveCategory:category[sheduleData.category],
          livetopannouncement:sheduleData.topPageAnnouncement,
          liveyoutube:sheduleData.youtubeLive,
          livepaidcontent:sheduleData.paidContent,
          liveDateAndTime:time,
          editname:true,
          editcategory:true,
          editpaidcontend:true,
          edittopannouncement:true,
          edityoutubelive:true,
          editliveticket:true,
          editlivedateTime:true,
          editMemo:true,
          editperformers:true,
          liveperformers:performernames,
          liveticket:sheduleData.liveTicket,
          livePaidAmount:parseFloat(sheduleData.paidContentAmount),
          liveTicketAmount:parseFloat(sheduleData.liveTicketAmount),
          liveTicketMaxNum:sheduleData.liveTicketMaximumNumber,
          AnnouncementImage:sheduleData.announcementImage,
          liveMemo:sheduleData.memo,
        });
        var temp = {};
        temp.Name = "Live Name";        
        temp.Content = <input className="editinput" disabled={this.state.editname} value={this.state.liveName}/>
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateLiveName} className="btn btnEdit" color='primary'>Edit</MDBBtn> : ""
        data2.push(temp)
        var temp = {};
        temp.Name = "Announcement Image";
        temp.Content =<><img width={600} height = {400}  src={sheduleData.announcementImage} /> <input type="file" onChange={this.updateImg} ref={(ref) => this.upload = ref} style={{ display: 'none' }}/></>
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={(e) => this.upload.click() } className="btn btnEdit" color='primary'>Edit</MDBBtn> : "" 
        data2.push(temp);
        var temp = {};
        temp.Name = "Performer";
        
        temp.Content =<input className="editinput" disabled={true} value={performernames}/>
        temp.Action = temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updatePerfomers} className="btn btnEdit" color='primary'>Edit</MDBBtn> : ""
        data2.push(temp)
       
        var temp = {};
        temp.Name = "Live Date and Time";
        temp.Content = temp.Content = <TextField
                                        id="datetime-local"
                                        type="datetime-local"
                                        defaultValue={time}
                                        disabled={this.state.editlivedateTime}
                                        InputLabelProps={{
                                          shrink: true
                                        }}
                                      />
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateLiveDateTime} className="btn btnEdit" color='primary'>Edit</MDBBtn> : ""
        data2.push(temp)
        var temp = {};
        temp.Name = "Category";
        temp.Content =<select  value={category[sheduleData.category]} disabled={this.state.editcategory}>
                        <option value={1}>EDM</option>
                        <option value={2}>HipHop</option>
                        <option value={3}>House</option>
                        <option value={4}>Techno</option>
                        <option value={5}>Trance</option>
                    </select>
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateCategory} className="btn btnEdit" color='primary'>Edit</MDBBtn> : "" 
        data2.push(temp)
        var temp = {};

        temp.Name = "Top Page Announcement";
        temp.Content =  temp.Content =<select  value={sheduleData.topPageAnnouncement} disabled={this.state.edittopannouncement}>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateAnnounceToppage} className="btn btnEdit" color='primary'>Edit</MDBBtn> : "" 
        data2.push(temp);

        var temp = {};
        temp.Name = "YouTube Live";
        temp.Content =  temp.Content =<select  value={sheduleData.youtubeLive} disabled={this.state.edityoutubelive}>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateYoutubeLive} className="btn btnEdit" color='primary'>Edit</MDBBtn> : "" 
        data2.push(temp);

        var temp = {};
        temp.Name = "Paid Content";
        temp.Content =  temp.Content =<select  value={sheduleData.paidContent} disabled={this.state.editpaidcontend}>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
                        
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updatePaidContent} className="btn btnEdit" color='primary'>Edit</MDBBtn> : "" 
        data2.push(temp);
        
        var temp = {};
        temp.Name = "Paid Content Amount";
        temp.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !sheduleData.paidContent} value={this.state.livePaidAmount+" USD"}/>
        if(!sheduleData.paidContent)
        {
          temp.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !sheduleData.paidContent} value={null}/>
        }
        temp.Action = "";
        data2.push(temp);

        var temp = {};
        temp.Name = "Live Ticket";
        temp.Content =  temp.Content =<select  value={sheduleData.liveTicket} disabled={this.state.editliveticket}>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateLiveticket} className="btn btnEdit" color='primary'>Edit</MDBBtn> : "" 
        data2.push(temp);
       
        var temp = {};
        temp.Name = "Live Ticket Amount";
        temp.Content = <input className="editinput" onChange={this.handleTicketAmount} disabled={this.state.editliveticket || !sheduleData.liveTicket} value={this.state.liveTicketAmount+" USD"}/>
        if(!sheduleData.liveTicket)
        {
          temp.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={this.state.editliveticket || !sheduleData.liveTicket} value={null}/>
        }
        temp.Action = "";
        data2.push(temp)
        var temp = {};
        temp.Name = "Live Ticket Maximum Number";
        temp.Content = <input className="editinput" onChange={this.handleTicketMaxNum} disabled={this.state.editliveticket || !sheduleData.liveTicket} value={this.state.liveTicketMaxNum}/>
        if(!sheduleData.liveTicket)
        {
          temp.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={this.state.editliveticket || !sheduleData.liveTicket} value={null}/>
        }
        temp.Action = "";
        data2.push(temp)
        var temp = {};
        temp.Name = "Memo";
        
        temp.Content = <textarea
                            className="Memoedit"
                            rows={4}
                            disabled={true}
                            value={sheduleData.memo}
                        />
        temp.Action = sheduleData.applicationStatus=="Pending" ||sheduleData.applicationStatus=="ScheduleLive" ? <MDBBtn onClick={this.updateLiveMemo} className="btn btnEdit" color='primary'>Edit</MDBBtn> : "";
        data2.push(temp);

        var temp = {};
        temp.Name = "Zoom URL";
        temp.Content = <a href={sheduleData.zoomUrl}>{sheduleData.zoomUrl}</a>;
        temp.Action = "";
        data2.push(temp)
        var temp = {};
        temp.Name = "Created Date and Time";
        temp.Content = sheduleData.dateCreated;
        temp.Action = "";
        data2.push(temp)
        var temp = {};
        temp.Name = "Updated Date and Time";
        temp.Content = sheduleData.dateUpdated;
        temp.Action = "";
        data2.push(temp)
        var temp = {};
        temp.Name = "Admin Account";
        temp.Content = sheduleData.updatedBy;
        temp.Action = "";
        data2.push(temp)
        var temp = {};
        var live_shedule_data = this.state.live_shedule_data;
        live_shedule_data.rows = data2;
        
        this.setState({
          live_shedule_data:live_shedule_data
        });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var artist_infor_data = this.state.artist_infor_data;
                artist_infor_data.rows = {}; 
                this.setState({
                  artist_infor_data:artist_infor_data
                });
                var live_shedule_data = this.state.live_shedule_data;
                live_shedule_data.rows = {};
                this.setState({
                  live_shedule_data:live_shedule_data
                });
            }
        }
    });
  }

  sendApprove=(event)=>{
    this.setState({
      sheduleRequest_modal: !this.state.sheduleRequest_modal
    });
    const {id} = this.props.match.params;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const fd = new FormData();
    fd.append('Approve', true);
    fd.append('_method', 'PATCH');
    axios.post(
      `${apiurl}/live/` + id + "/request",
      fd,
      { headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } }
    ).then((response)=>{
      this.setState({
        requestResultTitle:"APPLICATION APPROVED",
        requestResultContent:<span>Request for live schedule is approved completely.<br/>Email was sent to the Artist.</span>,
        sheduleRequestResult_modal: !this.state.sheduleRequestResult_modal
      });
      this.getlivescheduledata(id)
    }).catch((error)=>{
      if(error.response.status==401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
      this.setState({
        requestResultTitle:"REVIEW SCHEDULE REQUEST FAILED",
        requestResultContent:"Not allowed to update this record.",
        sheduleRequestResult_modal: !this.state.sheduleRequestResult_modal
      });
      console.log(error);
    });
  }

  sendDecline=(event)=>{
    this.setState({
      sheduleRequest_modal: !this.state.sheduleRequest_modal
    });
    const {id} = this.props.match.params;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const fd = new FormData();
    fd.append('Approve', false);
    fd.append('_method', 'PATCH');
    axios.post(
      `${apiurl}/live/` + id + "/request",
      fd,
      { headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } }
    ).then((response)=>{
      this.setState({
        requestResultTitle:"APPLICATION DECLINED",
        requestResultContent:<span>Request for live schedule is declined completely.<br/>Email was sent to the Artist.</span>,
        sheduleRequestResult_modal: !this.state.sheduleRequestResult_modal
      });
      this.getlivescheduledata(id);
    }).catch((error)=>{
      if(error.response.status==401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
      this.setState({
        requestResultTitle:"REVIEW SCHEDULE REQUEST FAILED",
        requestResultContent:"Not allowed to update this record",
        sheduleRequestResult_modal: !this.state.sheduleRequestResult_modal
      });
      console.log(error);
    });
  }

  updateLiveName = event=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editname;
    var liveitem,index;

    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Name")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    if(status){
      liveitem.Content = <input className="editinput" onChange={this.handleLivename} disabled={!this.state.editname} value={this.state.liveName}/>
      liveitem.Action = <MDBBtn onClick={this.updateLiveName} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        editname:!this.state.editname
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('LiveName', this.state.liveName);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/live/` + id + "/update/live_name",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        liveitem.Content = <input className="editinput" onChange={this.handleLivename} disabled={!this.state.editname} value={this.state.liveName}/>
        liveitem.Action = <MDBBtn onClick={this.updateLiveName} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data,
          editname:!this.state.editname
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
          liveitem.Content = <><input className="editinput" onChange={this.handleLivename} disabled={this.state.editname} value={this.state.liveName}/>
          <div className="error">{error.response.data.errors.LiveName?error.response.data.errors.LiveName.message:""}</div>
          </>
          liveitem.Action = <MDBBtn onClick={this.updateLiveName} className="btn btnEdit" color='primary'>Save</MDBBtn>
          live_shedule_data.rows[index] = liveitem;
          this.setState({
            live_shedule_data:live_shedule_data
          });
      });
    }   
  
  }

  updateLiveMemo=event=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editMemo;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Memo")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    if(status){
      liveitem.Content = <textarea
                              className="Memoedit"
                              rows={4}
                              disabled={!this.state.editMemo}
                              value={this.state.liveMemo}
                              onChange={this.handleMemo}
                          />
      
      liveitem.Action = <MDBBtn onClick={this.updateLiveMemo} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        editMemo:!this.state.editMemo
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Memo', this.state.liveMemo);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/live/` + id + "/update/memo",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        liveitem.Content = <textarea
                                className="Memoedit"
                                rows={4}
                                disabled={!this.state.editMemo}
                                value={this.state.liveMemo}
                                onChange={this.handleMemo}
                            />
        
        liveitem.Action = <MDBBtn onClick={this.updateLiveMemo} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data,
          editMemo:!this.state.editMemo
        });
        
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        liveitem.Content =<> <textarea
            className="Memoedit"
            rows={4}
            disabled={this.state.editMemo}
            value={this.state.liveMemo}
            onChange={this.handleMemo}
        />
        <div className="error">"Invalid Memo"</div>
        </>
          liveitem.Action = <MDBBtn onClick={this.updateLiveMemo} className="btn btnEdit" color='primary'>Save</MDBBtn>
          live_shedule_data.rows[index] = liveitem;
          this.setState({
            live_shedule_data:live_shedule_data
          });

        console.log(error);
      });
    }  
  }
  
  updateCategory = event=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editcategory;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Category")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }

    if(status){
      var category={"EDM":1,"HipHop":2,"House":3,"Techno":4,"Trance":5};
      liveitem.Content = <select value={category[this.state.liveCategory]} disabled={!this.state.editcategory} onChange={this.handleCategory}>
                            <option value={1}>EDM</option>
                            <option value={2}>HipHop</option>
                            <option value={3}>House</option>
                            <option value={4}>Techno</option>
                            <option value={5}>Trance</option>
                        </select>
      liveitem.Action = <MDBBtn onClick={this.updateCategory} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        editcategory:!this.state.editcategory
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Category', this.state.liveCategory);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/live/` + id + "/update/category",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        var category={"EDM":1,"HipHop":2,"House":3,"Techno":4,"Trance":5};
        liveitem.Content = <select value={category[this.state.liveCategory]} disabled={!this.state.editcategory} onChange={this.handleCategory}>
                              <option value={1}>EDM</option>
                              <option value={2}>HipHop</option>
                              <option value={3}>House</option>
                              <option value={4}>Techno</option>
                              <option value={5}>Trance</option>
                          </select>
        liveitem.Action = <MDBBtn onClick={this.updateCategory} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data,
          editcategory:!this.state.editcategory
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        var category={"EDM":1,"HipHop":2,"House":3,"Techno":4,"Trance":5};
        liveitem.Content =<> <select value={category[this.state.liveCategory]} disabled={this.state.editcategory} onChange={this.handleCategory}>
                              <option value={1}>EDM</option>
                              <option value={2}>HipHop</option>
                              <option value={3}>House</option>
                              <option value={4}>Techno</option>
                              <option value={5}>Trance</option>
                          </select>
                          <div className="error">Invalid Category</div>
                          </>
        liveitem.Action = <MDBBtn onClick={this.updateCategory} className="btn btnEdit" color='primary'>Save</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data
        });
      });
    }
   
  
  }

  updateAnnounceToppage=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.edittopannouncement;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Top Page Announcement")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }

    if(status){
      liveitem.Content = <select  value={this.state.livetopannouncement} disabled={!this.state.edittopannouncement} onChange={this.handleToppageAnouncement}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
      liveitem.Action = <MDBBtn onClick={this.updateAnnounceToppage} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        edittopannouncement:!this.state.edittopannouncement
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('TopPageAnnouncemnet', this.state.livetopannouncement);
      fd.append('_method', 'PATCH');
      axios.post(
         `${apiurl}/live/` + id + "/update/top_page_announcement",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        liveitem.Content = <select  value={this.state.livetopannouncement} disabled={!this.state.edittopannouncement} onChange={this.handleToppageAnouncement}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
        liveitem.Action = <MDBBtn onClick={this.updateAnnounceToppage} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data,
          edittopannouncement:!this.state.edittopannouncement
        });
    }).catch((error)=>{
      if(error.response.status==401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
      liveitem.Content = <><select  value={this.state.livetopannouncement} disabled={this.state.edittopannouncement} onChange={this.handleToppageAnouncement}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                          <div className="error">Invalid Top Announcement</div>
                          </>
      liveitem.Action = <MDBBtn onClick={this.updateAnnounceToppage} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
          live_shedule_data:live_shedule_data
      });
      });
    }
    
  }

  updateYoutubeLive=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.edityoutubelive;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="YouTube Live")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }

    if(status){
      liveitem.Content = <select  value={this.state.liveyoutube} disabled={!this.state.edityoutubelive} onChange={this.handleYouTube}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
      liveitem.Action = <MDBBtn onClick={this.updateYoutubeLive} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        edityoutubelive:!this.state.edityoutubelive
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('YoutubeLive', this.state.liveyoutube);
      fd.append('_method', 'PATCH');
      axios.post(
         `${apiurl}/live/` + id+ "/update/youtube_live",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        liveitem.Content = <select  value={this.state.liveyoutube} disabled={!this.state.edityoutubelive} onChange={this.handleYouTube}>
                              <option value={true}>Yes</option>
                              <option value={false}>No</option>
                            </select>
        liveitem.Action = <MDBBtn onClick={this.updateYoutubeLive} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
        live_shedule_data:live_shedule_data,
        edityoutubelive:!this.state.edityoutubelive
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        console.log(error);
      });
    }
   
  }

  updatePaidContent=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editpaidcontend;
    var itemPaidContent,indexPaidContent, itemPaidAmount, indexAmount;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Paid Content")
      {
        indexPaidContent = i;
        itemPaidContent = live_shedule_data.rows[i];
      }
      if(live_shedule_data.rows[i].Name=="Paid Content Amount")
      {
        indexAmount = i;
        itemPaidAmount = live_shedule_data.rows[i];
      }    
    }

    var bin =this.state.livepaidcontent;
    if(this.state.livepaidcontent=="true" || this.state.livepaidcontent=="false") {
      bin = this.state.livepaidcontent=="true"?true:false;
    }
    if(status){
      itemPaidContent.Content = <select  value={this.state.livepaidcontent} disabled={!this.state.editpaidcontend} onChange={this.handlePaidContent}>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </select>
      itemPaidContent.Action = <MDBBtn onClick={this.updatePaidContent} className="btn btnEdit" color='primary'>Save</MDBBtn>
      itemPaidAmount.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={!this.state.editpaidcontend || !bin} value={this.state.livePaidAmount}/>
     
      if(!bin)
      {
        itemPaidAmount.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !bin} value={""}/>
      }
      live_shedule_data.rows[indexPaidContent] = itemPaidContent;
      live_shedule_data.rows[indexAmount] = itemPaidAmount;
      this.setState({
        live_shedule_data:live_shedule_data,
        editpaidcontend:!this.state.editpaidcontend
      });
    
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('PaidContent', this.state.livepaidcontent);
      fd.append('PaidContentAmount', this.state.livepaidcontent?this.state.livePaidAmount:"");
      fd.append('_method', 'PATCH');
      axios.post(
         `${apiurl}/live/` + id + "/update/paid_content",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        itemPaidContent.Content = <select  value={this.state.livepaidcontent} disabled={!this.state.editpaidcontend} onChange={this.handlePaidContent}>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                  </select>
        itemPaidContent.Action = <MDBBtn onClick={this.updatePaidContent} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        
        itemPaidAmount.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={!this.state.editpaidcontend || !this.state.livepaidcontent} value={this.state.livePaidAmount+ " USD"}/>
        if(this.state.livepaidcontent=="false")
        {
          itemPaidAmount.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={true} value={""}/>
          this.setState({
            livePaidAmount:0
          })
        }
        live_shedule_data.rows[indexPaidContent] = itemPaidContent;
        live_shedule_data.rows[indexAmount] = itemPaidAmount;
        this.setState({
        live_shedule_data:live_shedule_data,
        editpaidcontend:!this.state.editpaidcontend,
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        if(error.response.status==400){
          itemPaidContent.Content = <select  value={this.state.livepaidcontent} disabled={this.state.editpaidcontend} onChange={this.handlePaidContent}>
                                      <option value={true}>Yes</option>
                                      <option value={false}>No</option>
                                    </select>
        
          itemPaidContent.Action = <MDBBtn onClick={this.updatePaidContent} className="btn btnEdit" color='primary'>Save</MDBBtn>

          itemPaidAmount.Content = <> <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !this.state.livepaidcontent} value={this.state.livePaidAmount}/>
                    <div className="error">{error.response.data.errors.PaidContentAmount? error.response.data.errors.PaidContentAmount.message:""}</div></>
          live_shedule_data.rows[indexPaidContent] = itemPaidContent;
          live_shedule_data.rows[indexAmount] = itemPaidAmount;
          this.setState({
          live_shedule_data:live_shedule_data,
          });
        }         
      });
    }
    
  }

  updateLiveticket=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editliveticket;
    var itemTicket,indexlive, itemAmount, indexAmount, itemMaxnum,indexMaxnum;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Ticket")
      {
        indexlive = i;
        itemTicket = live_shedule_data.rows[i];
      }
      if(live_shedule_data.rows[i].Name=="Live Ticket Amount")
      {
        indexAmount = i;
        itemAmount = live_shedule_data.rows[i];
      }
      if(live_shedule_data.rows[i].Name=="Live Ticket Maximum Number")
      {
        itemMaxnum = i;
        indexMaxnum = live_shedule_data.rows[i];
      } 
    }
    var bin = this.state.liveticket;
    if(this.state.liveticket=="true" || this.state.liveticket=="false") {
      bin = this.state.liveticket=="true"?true:false;
    }
    if(status){
      itemTicket.Content = <select  value={this.state.liveticket} disabled={!this.state.editliveticket} onChange={this.handleLiveTicket}>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </select>
      itemTicket.Action = <MDBBtn onClick={this.updateLiveticket} className="btn btnEdit" color='primary'>Save</MDBBtn>
     
      itemAmount.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={!this.state.editliveticket || !bin} value={this.state.liveTicketAmount}/>
      indexMaxnum.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={!this.state.editliveticket || !bin} value={this.state.liveTicketMaxNum}/>
      if(!bin)
      {
        itemAmount.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={!this.state.editliveticket || !bin} value={""}/>
        indexMaxnum.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={!this.state.editliveticket || !bin} value={""}/>
      }
      live_shedule_data.rows[indexlive] = itemTicket;
      live_shedule_data.rows[indexAmount] = itemAmount;
      live_shedule_data.rows[indexMaxnum] = indexMaxnum;
      this.setState({
        live_shedule_data:live_shedule_data,
        editliveticket:!this.state.editliveticket
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('LiveTicket', this.state.liveticket);
      fd.append('LiveTicketAmount', this.state.liveticket?(this.state.liveTicketAmount):"");
      fd.append('LiveTicketMaximumNumber', this.state.liveticket?(this.state.liveTicketMaxNum):"");
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/live/` + id + "/update/live_ticket",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        itemTicket.Content = <select  value={this.state.liveticket} disabled={!this.state.editliveticket} onChange={this.handleLiveTicket}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                              </select>
        itemTicket.Action = <MDBBtn onClick={this.updateLiveticket} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        itemAmount.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={!this.state.editliveticket || !this.state.liveticket} value={this.state.liveTicketAmount +" USD"}/>
        indexMaxnum.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={!this.state.editliveticket || !this.state.liveticket} value={this.state.liveTicketMaxNum}/>
        if(this.state.liveticket=="false")
        {
          itemAmount.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={true} value={""}/>
          indexMaxnum.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={true} value={""}/>
          this.setState({
            liveTicketAmount:0,
            liveTicketMaxNum:0,
          })
        }
        live_shedule_data.rows[indexlive] = itemTicket;
        live_shedule_data.rows[indexAmount] = itemAmount;
        live_shedule_data.rows[indexMaxnum] = indexMaxnum;
        this.setState({
        live_shedule_data:live_shedule_data,
        editliveticket:!this.state.editliveticket
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        if(error.response.status==400){
          itemTicket.Content = <select  value={this.state.liveticket} disabled={this.state.editliveticket} onChange={this.handleLiveTicket}>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </select>
          itemTicket.Action = <MDBBtn onClick={this.updateLiveticket} className="btn btnEdit" color='primary'>Save</MDBBtn>
          itemAmount.Content =  <>
                      <input className="editinput" onChange={this.handleTicketAmount} disabled={this.state.editliveticket || !this.state.liveticket} value={this.state.liveTicketAmount}/>
                      <div className="error">{error.response.data.errors.LiveTicketAmount?error.response.data.errors.LiveTicketAmount.message:""}</div>
                  </>
          indexMaxnum.Content = <> <input className="editinput" onChange={this.handleTicketMaxNum} disabled={this.state.editliveticket || !this.state.liveticket} value={this.state.liveTicketMaxNum}/>
                  <div className="error">{error.response.data.errors.LiveTicketMaximumNumber?error.response.data.errors.LiveTicketMaximumNumber.message:""}</div></>
          live_shedule_data.rows[indexlive] = itemTicket;
          live_shedule_data.rows[indexAmount] = itemAmount;
          live_shedule_data.rows[indexMaxnum] = indexMaxnum;
          this.setState({
          live_shedule_data:live_shedule_data
          });
        }


      });
    }
    
  }

  updateLiveDateTime=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editlivedateTime;
    var liveitem,index;

    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Date and Time")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    if(status){
      liveitem.Content = <TextField
                            id="datetime-local"
                            type="datetime-local"
                            disabled={!this.state.editlivedateTime}
                            InputLabelProps={{
                              shrink: true
                            }}
                            onChange={this.handleLiveDateTime}
                            defaultValue={this.state.liveDateAndTime}
                          />
      liveitem.Action = <MDBBtn onClick={this.updateLiveDateTime} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        editlivedateTime:!this.state.editlivedateTime
      });  
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      var date=this.state.liveDateAndTime.replace("T"," ");
      fd.append('LiveDateAndTime', date);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/live/`+ id + "/update/live_date_time",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        liveitem.Content = <TextField
                            id="datetime-local"
                            type="datetime-local"
                            disabled={!this.state.editlivedateTime}
                            InputLabelProps={{
                              shrink: true
                            }}
                            onChange={this.handleLiveDateTime}
                            defaultValue={this.state.liveDateAndTime}
                          />
      liveitem.Action = <MDBBtn onClick={this.updateLiveDateTime} className="btn btnEdit" color='primary'>Edit</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        editlivedateTime:!this.state.editlivedateTime
      });  
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        liveitem.Content = <><TextField
                              id="datetime-local"
                              type="datetime-local"
                              disabled={this.state.editlivedateTime}
                              InputLabelProps={{
                                shrink: true
                              }}
                              onChange={this.handleLiveDateTime}
                              defaultValue={this.state.liveDateAndTime}
                            />
                            <div className="error">Must be future date</div>
                            </>
        liveitem.Action = <MDBBtn onClick={this.updateLiveDateTime} className="btn btnEdit" color='primary'>Save</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data,
        });
      });
    }
    
  }

  updatePerfomers=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editperformers;
    var liveitem,index;

    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Performer")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    if(status){
      liveitem.Content = <input className="editinput" onChange={this.handlePerfomers} disabled={!this.state.editperformers} value={this.state.liveperformers}/>
      liveitem.Action = <MDBBtn onClick={this.updatePerfomers} className="btn btnEdit" color='primary'>Save</MDBBtn>
      live_shedule_data.rows[index] = liveitem;
      this.setState({
        live_shedule_data:live_shedule_data,
        editperformers:!this.state.editperformers
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      var liveperformers = (this.state.liveperformers).split(",");
      var livenames=new Array();
      for(var i=0;i<liveperformers.length;i++)
      {
        var temp={};
        temp.name=liveperformers[i];
        livenames.push(temp);
      }

      var config = {
        method: 'patch',
        url: `${apiurl}/live/` + id + "/update/performer",
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data :JSON.stringify({"performer":livenames})
      };
      axios(config).then((response)=>{
        liveitem.Content = <input className="editinput" onChange={this.handlePerfomers} disabled={!this.state.editperformers} value={this.state.liveperformers}/>
        liveitem.Action = <MDBBtn onClick={this.updatePerfomers} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data,
          editperformers:!this.state.editperformers
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        liveitem.Content =<> 
        <input className="editinput" onChange={this.handlePerfomers} disabled={this.state.editperformers} value={this.state.liveperformers}/>
        <div className="error">Invalid performer names</div>
        </>
        liveitem.Action = <MDBBtn onClick={this.updatePerfomers} className="btn btnEdit" color='primary'>Save</MDBBtn>
        live_shedule_data.rows[index] = liveitem;
        this.setState({
          live_shedule_data:live_shedule_data
        });
      });
    }
   
  }
  handlePerfomers=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Performer")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content = <input className="editinput" onChange={this.handlePerfomers} disabled={this.state.editperformers} value={event.target.value}/>
    live_shedule_data.rows[index] = liveitem;
    
    this.setState({
      liveperformers:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handleMemo=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Memo")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    var val=(event.target.value).slice(0,50);
    liveitem.Content = <textarea
                            className="Memoedit"
                            rows={4}
                            disabled={this.state.editMemo}
                            value={val}
                            onChange={this.handleMemo}
                        />
    live_shedule_data.rows[index] = liveitem;
    
    this.setState({
      liveMemo:val,
      live_shedule_data:live_shedule_data
    });
  }

  handleLiveTicket=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var itemTicket,indexlive, itemAmount, indexAmount, itemMaxnum,indexMaxnum;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Ticket")
      {
        indexlive = i;
        itemTicket = live_shedule_data.rows[i];
      }
      if(live_shedule_data.rows[i].Name=="Live Ticket Amount")
      {
        indexAmount = i;
        itemAmount = live_shedule_data.rows[i];
      }
      if(live_shedule_data.rows[i].Name=="Live Ticket Maximum Number")
      {
        itemMaxnum = i;
        indexMaxnum = live_shedule_data.rows[i];
      } 
    }

    var bin = event.target.value=="true"?true:false;
    
    itemTicket.Content =  <select  value={event.target.value} onChange={this.handleLiveTicket}>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </select>
    itemAmount.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={this.state.editliveticket || !bin} value={this.state.liveTicketAmount}/>
    indexMaxnum.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={this.state.editliveticket || !bin} value={this.state.liveTicketMaxNum}/>
    if(!bin)
    {
      itemAmount.Content =  <input className="editinput" onChange={this.handleTicketAmount} disabled={this.state.editliveticket || !bin} value={""}/>
      indexMaxnum.Content =  <input className="editinput" onChange={this.handleTicketMaxNum} disabled={this.state.editliveticket || !bin} value={""}/>
    }
    live_shedule_data.rows[indexlive] = itemTicket;
    live_shedule_data.rows[indexAmount] = itemAmount;
    live_shedule_data.rows[indexMaxnum] = indexMaxnum;

    this.setState({
        live_shedule_data:live_shedule_data
    });
    this.setState({
      liveticket:event.target.value
    });

  }

  handleTicketAmount=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Ticket Amount")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content = <input className="editinput" onChange={this.handleTicketAmount} disabled={this.state.editliveticket || !this.state.liveticket} value={event.target.value}/>
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      liveTicketAmount:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handleTicketMaxNum=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Ticket Maximum Number")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content = <input className="editinput" onChange={this.handleTicketMaxNum} disabled={this.state.editliveticket || !this.state.liveticket} value={event.target.value}/>
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      liveTicketMaxNum:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handleLivename=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Name")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content = <input className="editinput" onChange={this.handleLivename} disabled={this.state.editname} value={event.target.value}/>
   
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      liveName:event.target.value,
      live_shedule_data:live_shedule_data
    });
    
  }

  handleCategory=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Category")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content =  <select disabled={this.state.editcategory} value={event.target.value} onChange={this.handleCategory}>
                            <option value={1}>EDM</option>
                            <option value={2}>HipHop</option>
                            <option value={3}>House</option>
                            <option value={4}>Techno</option>
                            <option value={5}>Trance</option>
                        </select>
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      liveCategory:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handleToppageAnouncement=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Top Page Announcement")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content =  <select  value={this.state.livetopannouncement} value={event.target.value} onChange={this.handleToppageAnouncement}>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      livetopannouncement:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handleYouTube=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="YouTube Live")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content =  <select  value={this.state.liveyoutube} value={event.target.value} onChange={this.handleYouTube}>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      liveyoutube:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handlePaidContent=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var status = this.state.editpaidcontend;
    var itemPaidContent,indexPaidContent, itemPaidAmount, indexAmount;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Paid Content")
      {
        indexPaidContent = i;
        itemPaidContent = live_shedule_data.rows[i];
      }
      if(live_shedule_data.rows[i].Name=="Paid Content Amount")
      {
        indexAmount = i;
        itemPaidAmount = live_shedule_data.rows[i];
      }    
    }
    
    var bin = event.target.value=="true"?true:false;
    itemPaidContent.Content =  <select  value={event.target.value} onChange={this.handlePaidContent}>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </select>
    itemPaidAmount.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !bin} value={this.state.livePaidAmount}/>
    if(!bin)
    {
      itemPaidAmount.Content =  <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !bin} value={""}/>
    }
    live_shedule_data.rows[indexPaidContent] = itemPaidContent;
    live_shedule_data.rows[indexAmount] = itemPaidAmount;
    this.setState({
        live_shedule_data:live_shedule_data
    });
    this.setState({
      livepaidcontent:event.target.value
    });
  }

  handlePaidAmount=(event)=>{
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Paid Content Amount")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content = <input className="editinput" onChange={this.handlePaidAmount} disabled={this.state.editpaidcontend || !this.state.livepaidcontent} value={event.target.value}/>
    live_shedule_data.rows[index] = liveitem;
    this.setState({
      livePaidAmount:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  handleLiveDateTime=(event)=>{
   
    var live_shedule_data = this.state.live_shedule_data;
    var liveitem,index;
    for(var i=0; i<live_shedule_data.rows.length;i++)
    {
      if(live_shedule_data.rows[i].Name=="Live Date and Time")
      {
        index = i;
        liveitem = live_shedule_data.rows[i];
        break;
      }   
    }
    liveitem.Content = <TextField
                            id="datetime-local"
                            type="datetime-local"
                            disabled={this.state.editlivedateTime}
                            InputLabelProps={{
                              shrink: true
                            }}
                            onChange={this.handleLiveDateTime}
                            defaultValue={event.target.value}
                          />
    live_shedule_data.rows[index] = liveitem;
    
    this.setState({
      liveDateAndTime:event.target.value,
      live_shedule_data:live_shedule_data
    });
  }

  updateImg = (event)=>{
    const {id} = this.props.match.params;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const fd = new FormData();
    fd.append('AnnouncementImage', event.target.files[0]);
    fd.append('_method', 'PATCH');
    axios.post(
      `${apiurl}/live/` + id + "/update/announcement_image",
      fd,
      { headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } }
    ).then((response)=>{
      this.getlivescheduledata(id)
    }).catch((error)=>{
      if(error.response.status==401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
    });
  }


  render() {
    const { activeItem,live_shedule_data,artist_infor_data,sheduleRequest_modal,liveName,AnnouncementImage,liveDateAndTime, requestResultTitle, requestResultContent,sheduleRequestResult_modal} = this.state;
    return (
        <MDBContainer className="maincontainer">
          <span style={{color:'blue'}}>Live Application &gt;</span><span> Detail</span>
            <SectionContainer noBorder>
            <MDBCard>
                <MDBCardBody>
            <MDBNav className='nav-tabs'>
                <MDBNavItem>
                    <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '1'}
                    onClick={this.toggle('1')}
                    role='tab'
                    >
                   Live Schedule
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '2'}
                    onClick={this.toggle('2')}
                    role='tab'
                    >
                    Artist Information
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavbarNav right className='nav-tabs'>
                  <MDBNavItem >
                  
                    <MDBBtn className="danger_requestBtn" onClick={this.togglemodal("sheduleRequest_modal")}>Approve</MDBBtn> 
            
                  </MDBNavItem>
                </MDBNavbarNav>
                
                </MDBNav>
                <MDBTabContent activeItem={activeItem}>
                <MDBTabPane tabId='1' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                            <h4> Live Schedule</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable striped>
                     {live_shedule_data.rows.length ? <MDBTableBody rows={live_shedule_data.rows} />: <MDBTableBody />}
                     {live_shedule_data.rows.length?"":<caption className="noresult">No result found</caption>}
                    </MDBTable>
                    </MDBCol>                  

                </MDBTabPane>
                <MDBTabPane tabId='2' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                        <h4>Artist Information</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable striped>
                     {artist_infor_data.rows.length ? <MDBTableBody rows={artist_infor_data.rows} />: <MDBTableBody />}
                     {artist_infor_data.rows.length?"":<caption className="noresult">No result found</caption>}
                    </MDBTable>
                    </MDBCol>                  

                </MDBTabPane>
                </MDBTabContent>
            </MDBCardBody>
            </MDBCard> 
            </SectionContainer>

            <MDBModal className="requestModal"  isOpen={sheduleRequest_modal} toggle={this.togglemodal("sheduleRequest_modal")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow>
                        <h4 className="modal-title font-semibold text-3xl">Approve</h4>
                    </MDBRow>
                    <MDBRow>
                        <label className="modal-title font-semibold text-2xl text-center">After approving this request, email with <br/> the LIVE LINK will automatically send to the Artist</label>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol className="col-6">
                       <div>Live name</div>
                       <div className="font-semibold mb-3">{liveName}</div>
                       <div>Announcement Image</div>
                       <img width={600} height = {400}  src={AnnouncementImage} />
                      </MDBCol>
                      <MDBCol className="col-6">
                        <div className="mt-24 ml-8">Date</div>
                        <div  className="font-semibold mb-12 ml-8">{liveDateAndTime.split("T")[0]}</div>                        
                        <div className="ml-8">Time</div>
                        <div className="font-semibold ml-8">{liveDateAndTime.split("T")[1]}</div>
                      </MDBCol>
                    </MDBRow>
                                    
                    <MDBRow className="mt-4 mb-4">                  
                    <MDBCol className="col-4 text-center">
                        <MDBBtn outline className="btn btnreset" onClick={this.togglemodal("sheduleRequest_modal")}>CLOSE</MDBBtn> 
                    </MDBCol>
                    <MDBCol className="col-8 text-right">
                        <MDBBtn outline className="btn btnreset" onClick={this.sendDecline}>DECLINE</MDBBtn> 
                        <MDBBtn color='elegant' className="btn btnrequest" onClick={this.sendApprove}>APPROVE</MDBBtn> 
                    </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal>

             <MDBModal className="requestModal"  isOpen={sheduleRequestResult_modal} toggle={this.togglemodal("sheduleRequestResult_modal")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow className="my-6">
                        <h4 className="modal-title font-semibold text-3xl">{requestResultTitle}</h4>
                    </MDBRow>
                    <MDBRow className="my-6">
                        <label className="modal-title font-semibold text-2xl text-center">{requestResultContent}</label>
                    </MDBRow>
                      
                    <MDBRow className="mt-4 mb-4">                  
                      <MDBCol className="col-12 text-center">
                          <MDBBtn color='elegant' className="btn btnrequest" onClick={this.togglemodal("sheduleRequestResult_modal")}>CLOSE</MDBBtn> 
                      </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal>         
        </MDBContainer>
    );
  }
}

export default Live_Application_detail;
