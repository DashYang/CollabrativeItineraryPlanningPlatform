package cn.edu.fudan.websocket;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.edu.fudan.mybaits.EntityOperation;
import cn.edu.fudan.mybaits.Issue;
import cn.edu.fudan.mybaits.MessageLog;

import com.alibaba.fastjson.JSONObject;

/**
 * Servlet implementation class saveMessage
 */
@WebServlet("/saveMessage")
public class saveMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public saveMessage() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8");
		String date = request.getParameter("date");
		String city = request.getParameter("city");
		String group = request.getParameter("group");
		String type = request.getParameter("type");
		JSONObject json = new JSONObject();
		if(type.equals("getMessageLog")) {
		
//			List<MessageLog> messageLogs = MessageLog.getList();
			List<MessageLog> messageLogs = MessageLog.getItineraryByMapInfo(date, city, group);
//			for(MessageLog messageLog : messageLogs) {
//				System.out.println(messageLog);
//			}
			json.put("result", true);
			json.put("list", messageLogs);
		} else if(type.equals("getItinerary")) {
			String user = request.getParameter("user");
			List<MessageLog> messageLogs = MessageLog.getItineraryByUser(user);
//			for(MessageLog messageLog : messageLogs) {
//				System.out.println(messageLog);
//			}
			json.put("result", true);
			json.put("list", messageLogs);
		}
		PrintWriter pw = response.getWriter();
		pw.print(json.toString());
		pw.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doGet(request, response);
	}

}
