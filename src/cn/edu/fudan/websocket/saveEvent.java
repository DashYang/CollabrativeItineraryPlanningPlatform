package cn.edu.fudan.websocket;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.edu.fudan.mybaits.EntityOperation;
import cn.edu.fudan.mybaits.Event;
import cn.edu.fudan.mybaits.Group;

import com.alibaba.fastjson.JSONObject;

/**
 * Servlet implementation class saveEvent
 */
@WebServlet("/saveEvent")
public class saveEvent extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public saveEvent() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8");
		String type = request.getParameter("type");
		System.out.println(type);
		if (type.equals("saveEvent")) {
			
			String username = request.getParameter("username");
			String groupId = request.getParameter("groupId");
			String startDate = request.getParameter("startDate");
			String endDate = request.getParameter("endDate");
			String city = request.getParameter("city");
			String event = request.getParameter("event");
			String user_status = request.getParameter("user_status");
			String event_status = request.getParameter("event_status");
			
			JSONObject json = new JSONObject();
			Event newEvent = new Event(username, Integer.parseInt(groupId), startDate, endDate, city, event , user_status, event_status);
			EntityOperation operation = (EntityOperation) newEvent;
			operation.save();
			json.put("result", true);

			PrintWriter pw = response.getWriter();
			pw.print(json.toString());

			pw.close();
		} else if(type.equals("getEvents")){
			JSONObject json = new JSONObject();
			String groupId = request.getParameter("groupId");
			List<Event> groups = Event.getList(groupId);
			json.put("result", true);
			json.put("list", groups);
			PrintWriter pw = response.getWriter();
			pw.print(json.toString());
			
			pw.close();
		} 
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doGet(request, response);
	}

}
