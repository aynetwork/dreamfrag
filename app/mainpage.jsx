import React from 'react';
import {render} from 'react-dom';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clips: [],
            clips_count: 0,
            selected_clips_duration: 0,
            streamer_name: localStorage.getItem("streamer_name") ? localStorage.getItem("streamer_name") : "all",
            period: localStorage.getItem("period") ? localStorage.getItem("period") : "month",
            limit: localStorage.getItem("limit") ? localStorage.getItem("limit") : "2",
            language: localStorage.getItem("language") ? localStorage.getItem("language") : "",
            streamers_list: [],
            identy: "",
            jobs: [],
            thumbnail: null,
            current_clip: {},
            game: false,
            custom_clips: [],
            selected_clips: {}
        };


        this.showIframe = this.showIframe.bind(this);
        this.selectClip = this.selectClip.bind(this);
        this.deselectClip = this.deselectClip.bind(this);
        this.getClip = this.getClip.bind(this);
        this.addStreamer = this.addStreamer.bind(this);
        this.getStreamers = this.getStreamers.bind(this);
        this.getClips = this.getClips.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.selectStreamer = this.selectStreamer.bind(this);
        this.recalculate = this.recalculate.bind(this);
        this.createJob = this.createJob.bind(this);
        this.getJobs = this.getJobs.bind(this);
        this.customJob = this.customJob.bind(this);
        this.selectThumbnail = this.selectThumbnail.bind(this);
        this.deselectThumbnail = this.deselectThumbnail.bind(this);
        this.addClipToCustomJob = this.addClipToCustomJob.bind(this);
        this.addCustomJob = this.addCustomJob.bind(this);

    }

    changeFilter(){
        localStorage.setItem("limit", $("[name=limit]").val());
        localStorage.setItem("period", $("[name=period]").val());
        localStorage.setItem("language", $("[name=language]").val());

        this.setState({
            limit : $("[name=limit]").val(),
            period : $("[name=period]").val(),
            language : $("[name=language]").val(),
        }, function () {
            this.getClips();
        });
    }

    addClipToCustomJob(event){
        event.preventDefault();
        let value = $(event.target).find("input[type='text']").val();
        $(event.target).find("input[type='text']").val("");

        const temp =  value.match(/([A-Z])\w+/g);

        if (value.indexOf("twitch") != -1) {
            if (temp.length == 0) {
                alert("Can't parse the string " + value);
                return false;
            }
            value = "https://clips.twitch.tv/" + temp[0];
        }

        this.state.custom_clips.push({
            info : value,
            slug : value,
        });
        this.setState({
            custom_clips : this.state.custom_clips
        });
    }

    addCustomJob(){
        const self = this;

        if (this.state.custom_clips.length === 0) {
            alert("Add clips. No clips found for this job!");
            return false;
        }

        const date = new Date();

        $.ajax({
            url : "/streamer/job",
            dataType : "json",
            contentType: "application/json",
            beforeSend : function(){
                $("#add_job").modal("hide");
            },
            method : "post",
            timeout : 3000,
            data : JSON.stringify({
                title : "Custom_job_" + date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear() + "_" + date.getHours() + "_" + date.getMinutes(),
                stage : "inited",
                clips : this.state.custom_clips,
                youtube_channel : self.state.youtube_channel,
                thumbnail : "https://clips-media-assets2.twitch.tv/vod-513755970-offset-262-preview-480x272.jpg",
                channel : self.state.streamer_name,
                period : self.state.period + "ly",
            }),
            success : function (data) {
                if (data && data.id) {
                    self.setState({
                        selected_clips : {},
                        thumbnail : null,
                        selected_clips_duration : 0

                    });
                }
            },
            error : function () {
                console.log(arguments);
            },
            complete : function () {

            }

        });
    }

    getJobs(){
        $("#current_jobs").modal("show");

        const self = this;

        $.ajax({
            url : "/streamer/jobs",
            dataType : "json",
            contentType: "application/json",

            method : "get",
            timeout : 3000,

            success : function (data) {

                self.setState({
                    jobs : data
                });

            },
            error : function () {
                console.log(arguments);
            },
            complete : function () {

            }

        });
    }
    customJob(){
        $("#custom_jobs").modal("show");

        const self = this;


    }

    createJob(){
        const self = this;

        let clips = [];

        for (const slug in this.state.selected_clips) {
            const info = {};
            // info.info = this.state.selected_clips[slug][0].url;
            info.info = "https://clips.twitch.tv/" + slug;
            info.slug = slug;
            clips.push(info);
        }

        if (clips.length === 0) {
            alert("Add clips. No clips found for this job!");
            return false;
        }
        if (!self.state.thumbnail) {
            alert("Thumbnail not found!");
            return false;
        }

        $.ajax({
            url : "/streamer/job",
            dataType : "json",
            contentType: "application/json",
            beforeSend : function(){
                $("#add_job").modal("hide");
            },
            method : "post",
            timeout : 3000,
            data : JSON.stringify({
                title : $("#job_title").val(),
                stage : "inited",
                clips : clips,
                youtube_channel : self.state.youtube_channel,
                thumbnail : self.state.thumbnail,
                channel : self.state.streamer_name,
                period : self.state.period + "ly",
            }),
            success : function (data) {
                if (data && data.id) {
                    self.setState({
                        selected_clips : {},
                        thumbnail : null,
                        selected_clips_duration : 0

                    });
                }
            },
            error : function () {
                console.log(arguments);
            },
            complete : function () {

            }

        });

    }

    selectStreamer(event){
        const streamer_name = $(event.target).attr("data-streamer_name");
        const youtube_channel = $(event.target).attr("data-youtube_channel");

        $(".list-group-item").removeClass("active");
        $(event.target).addClass("active");
        this.setState({
            streamer_name : streamer_name,
            youtube_channel : youtube_channel,
            game : $(event.target).attr("data-game") == "true" ? true : null,
            clips : [],
        }, function () {
            this.getClips();
        });
    }

    getClips(){
        const self = this;

        let isGame = self.state.game ? "game=" + self.state.streamer_name : "channel=" + self.state.streamer_name;
        if (self.state.streamer_name == "all") {
            isGame = "";
        }
        let isLanguage = self.state.language ? "&language=" + self.state.language : "";

        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/kraken/clips/top?"
                + isGame
                + "&period=" + this.state.period
                + "&limit=" + this.state.limit
                + isLanguage
            ,beforeSend: function (request) {
                request.setRequestHeader("Client-ID", "906jiv66np3me72xg7qhgnnfb3lxt9");
                request.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
            },
            success: function (data) {
                self.setState({
                    clips: data.clips,
                    clips_count: data.clips.length,
                }, function () {
                    console.log(this.state.clips);



                });


            }
        });

    }

    componentDidUpdate(){
        $(".card").find("[data-utc]").each(function (index, element) {
            const date = new Date($(element).attr("data-utc"));
            $(element).html(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes())
        })
    }

    setSelects(){
        $("[name=limit]").val(this.state.limit);
        $("[name=period]").val(this.state.period);
        $("[name=language]").val(this.state.language);
    }

    componentDidMount() {
        const self = this;

        this.getClips();
        this.getStreamers();
        this.setSelects();

        $('#clip-modal').on('hidden.bs.modal', function (e) {
            $("#clip-modal").find("iframe").attr("src", "");
        });

        $('#add_job').on('shown.bs.modal', function (e) {
            const date = new Date();
            let name = self.state.streamer_name;
            name = name.replace(/\W/g, "_");
            const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
            const hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
            $("#job_title").val(date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear()+ "_" +
                hours + "_" + minutes  + "_"  + name + "_" + self.state.period );
        })
    }

    getClip(slug) {
        return this.state.clips.filter(clip => {
            if (clip.slug === slug) return clip;
        })
    }
    addStreamer(event) {

        const self = this;
        event.preventDefault();

        const $btn = $(event.target).find("[type='submit']");
        $btn.attr("disabled", "disabled");
        $.ajax({
            url : "/streamer/create",
            dataType : "json",
            contentType: "application/json",

            method : "post",
            timeout : 3000,
            data : JSON.stringify({
                name : $.trim($("#streamer_name").val()),
                category : $.trim($("#category").val()),
                game : $.trim($("#is_game").val()) =="false" ? false : true,
                _csrf : $("#csrf_").attr("value"),
            }),
            success : function (data) {
                if (data && data.id) {
                    $("#add_streamer").modal("hide");
                }
                self.setState({
                    streamer_name : data.name
                });

                self.getStreamers();


            },
            error : function () {
                console.log(arguments);
            },
            complete : function () {
                $btn.removeAttr("disabled");

            }

        });
    }

    getStreamers(){
        const self = this;
        $.ajax({
            url : "/streamer",
            dataType : "json",
            method : "get",
            timeout : 3000,

            success : function (data) {
                self.setState({
                    streamers_list : data
                })

            },
            error : function () {
                console.log(arguments);
            },
            complete : function () {


            }

        });
    }

    showIframe(event) {
        const self = this;
        const clip = this.getClip($(event.target).attr("data-slug"));
        this.setState({
            current_clip: clip ? clip[0] : null
        });
        $("#clip-modal").find("iframe").removeClass("hidden").attr("src", $(event.target).attr("data-id"));
        // $(event.target).addClass("hidden");
        $("#clip-modal").modal("show");
    }

    selectClip(event) {
        const self = this;
        event.preventDefault();
        this.state.selected_clips[$(event.target).attr("data-slug")] = this.getClip($(event.target).attr("data-slug"));

        this.recalculate();

        this.setState({
            selected_clips : this.state.selected_clips,
        }, function(){
            console.log(this.state.selected_clips);
        });

    }
    selectThumbnail(event) {
        const self = this;
        event.preventDefault();
        this.state.thumbnail = $(event.target).attr("data-thumbnail");

        this.setState({
            thumbnail : this.state.thumbnail,
        }, function(){
            console.log(this.state.thumbnail);
        });
    }

    deselectThumbnail(event) {
        const self = this;
        event.preventDefault();
        this.state.thumbnail = "";

        this.setState({
            thumbnail : this.state.thumbnail,
        }, function(){
            console.log(this.state.thumbnail);
        });
    }

    recalculate(){
        let duration = 0;
        for (const selectedClip in this.state.selected_clips) {
            duration+=this.state.selected_clips[selectedClip][0].duration;
        }
        this.setState({
            selected_clips_duration : duration

        });
    }
    deselectClip(event) {
        const self = this;
        event.preventDefault();

        delete this.state.selected_clips[$(event.target).attr("data-slug")];
        this.recalculate();

        this.setState({
            selected_clips : this.state.selected_clips
        }, function(){
            console.log(this.state.selected_clips);
        });

    }

    render() {

        return (<div className="row mt-3">




            <div className="col-3">
                <button className="btn btn-block btn-sm btn-success" data-toggle="modal" data-target="#add_streamer">Add streamer or game</button>


                    <div className="list-group mt-1">
                        {this.state.streamers_list.map((streamer, key) => (
                            <a href="#" className={streamer.game == true ?
                                "list-group-item list-group-item-action list-group-item-primary" :
                                "list-group-item list-group-item-action"} key={key} data-game={streamer.game}
                               data-streamer_name={streamer.name}
                               data-youtube_channel={streamer.youtube_channel}
                               onClick={this.selectStreamer}>{streamer.name}</a>
                        ))}
                    </div>
            </div>
            <div className="col-9">
                <div className="row card p-1">
                    <div className="d-flex justify-content-between">
                        Streamer: {this.state.streamer_name}
                        <span>
                            Clips count : {this.state.clips_count}
                        </span>

                        <select name="limit" onChange={this.changeFilter} className="form-control form-control-sm select-width">
                            <option>limit</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <select name="period" onChange={this.changeFilter} className="form-control form-control-sm select-width">
                            <option>period</option>
                            <option value="day">day</option>
                            <option value="week">week</option>
                            <option value="month">month</option>
                            <option value="all">all</option>
                        </select>
                        <select name="language"  onChange={this.changeFilter} className="form-control form-control-sm select-width">
                            <option>language</option>
                            <option value="es">es</option>
                            <option value="en">en</option>
                            <option value="ru">ru</option>
                            <option value="">all</option>
                        </select>

                       {/* <small>

                            <div className="btn-group">
                                <div className="dropdown btn-group">
                                    <button className="btn btn-info dropdown-toggle" type="button"
                                            id="dropdownMenuButton"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-cog"></i>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#" data-toggle="modal"
                                           data-target="#editModal">Edit theme</a>

                                        <a className="dropdown-item" href="#" id="delete" data-id="${task.id}"
                                           data-toggle="modal" data-target="#exampleModal">Delete theme</a>
                                    </div>
                                </div>
                            </div>
                        </small>*/}
                    </div>
                </div>

                <div className="row mt-1">
                    {
                        this.state.clips.map((clip, key) => (


                            <div className="card card-width col-6" key={key}>

                                <img src={clip.thumbnails.medium} className="mt-1" onClick={this.showIframe} data-slug={clip.slug}
                                     data-id={clip.embed_url} alt=""/>

                                {/*{clip.embed_html}*/}

                               {/* <iframe className="embed-responsive"
                                        src={clip.embed_html}
                                        frameBorder="0"></iframe>*/}

                                <div className="card-body">
                                    <div className="card-title">
                                        <div>Streamer:  : {clip.broadcaster.name}</div>
                                        <div>Title : {clip.title}</div>
                                        <div>Author : {clip.curator.display_name}</div>
                                        <div>Views : {clip.views}</div>
                                        <div>Duration : {clip.duration}</div>
                                        <div>Game : {clip.game}</div>
                                        <div>language : {clip.language}</div>
                                        <div>created_at : <span data-utc={clip.created_at}></span></div>
                                    </div>
                                    {/*<p className="card-text">Some quick example text to build on the card title and make
                                       up the bulk of the card's content.</p>*/}
                                    {this.state.selected_clips[clip.slug]?
                                        <a href="#" className="btn btn-warning" data-slug={clip.slug} onClick={this.deselectClip}>SELECTED</a>
                                    :
                                    <a href="#" className="btn btn-primary" data-slug={clip.slug} onClick={this.selectClip}>SELECT</a>}


                                    {this.state.thumbnail?
                                        <span>{clip.thumbnails.medium == this.state.thumbnail ?
                                                <a href={""} className="btn btn-warning ml-2"
                                                   onClick={this.deselectThumbnail}
                                                   data-thumbnail={clip.thumbnails.medium}>THUMBNAILED</a> : null}</span>
                                        :
                                        <a href={""} className="btn btn-primary ml-2" onClick={this.selectThumbnail} data-thumbnail={clip.thumbnails.medium}>THUMBNAIL</a>}


                                </div>
                            </div>

                        ))
                    }
                </div>
            </div>

            <div className="modal" tabIndex="-1" role="dialog" id="clip-modal">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.state.current_clip.slug}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                <iframe height="700px" className=" embed-responsive"
                                        src={this.state.current_clip.embed_url}
                                        frameBorder="0"></iframe>
                            </p>
                        </div>
                        <div className="modal-footer">
                            {this.state.selected_clips[this.state.current_clip.slug]?
                                <a href="#" className="btn btn-warning" data-slug={this.state.current_clip.slug} onClick={this.deselectClip}>SELECTED</a>
                                :
                                <a href="#" className="btn btn-primary" data-slug={this.state.current_clip.slug} onClick={this.selectClip}>SELECT</a>}
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal" tabIndex="-1" role="dialog" id="add_streamer">
                <div className="modal-dialog modal-sm" role="document">
                    <form action="" onSubmit={this.addStreamer}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add streamer or game</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                    <input type="text" className="form-control" placeholder="Streamer name or game" id="streamer_name" name="streamer_name" />

                                <label className=" mt-2" htmlFor="is_game">Is game?</label>
                                <select id="is_game" className="form-control form-control-sm ">
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                </select>

                                <input type="text" className="form-control form-control-sm mt-3" placeholder="Youtube category id" id="category" name="streamer_name" />
                                <input type="text" className="form-control form-control-sm mt-3" placeholder="Youtube channel identy" id="identy" name="identy" />




                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="modal" tabIndex="-1" role="dialog" id="add_job">
                <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add job</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                    <input type="text" className="form-control" placeholder="Job title" required id="job_title" name="streamer_name" />

                           </div>
                            <div className="modal-footer">
                                <button type="button"  onClick={this.createJob} className="btn btn-primary">Save</button>
                            </div>
                        </div>
                </div>
            </div>


            <div className="modal" tabIndex="-1" role="dialog" id="current_jobs">
                <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Current jobs</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <table className="table">
                                    <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Stage</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                {
                                    this.state.jobs.map((item, key) => (
                                        <tr key={key}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.title}</td>
                                            <td>{item.stage}</td>
                                        </tr>
                                    ))
                                }

                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                </div>
            </div>



            <div className="modal" tabIndex="-1" role="dialog" id="custom_jobs">
                <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Custom job</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.custom_clips.map((item, key) => (
                                                <tr key={key}>
                                                    <td>{item.info}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                                <form action="" onSubmit={this.addClipToCustomJob}>
                                    <div className={"input-group"}>
                                        <input type="text" placeholder={"Clip url"} className={"form-control group"}/> <input
                                        type="submit" className={"btn btn-primary"} value={"Add"}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.addCustomJob}>Add job</button>
                            </div>
                        </div>
                </div>
            </div>


            <div className="fixed-bottom bg-warning border-top">
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <span>Selected count: {Object.keys(this.state.selected_clips).length}</span>
                        <span className="ml-3">Selected clips duration: {this.state.selected_clips_duration}</span>
                        <button data-toggle="modal" data-target="#add_job" className={"btn btn-sm btn-danger p-1 ml-5"}>Create job</button>
                        <button onClick={this.getJobs}  className={"btn btn-sm btn-success p-1 ml-5"}>Current jobs</button>
                        <button onClick={this.customJob}  className={"btn btn-sm btn-success p-1 ml-5"}>Custom job</button>
                    </div>
                </div>
            </div>


        </div>)

    }
}

$(function () {

    render(
        <App/>
        , document.getElementById('mainpage'));
})


