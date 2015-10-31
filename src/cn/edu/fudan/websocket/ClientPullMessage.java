package cn.edu.fudan.websocket;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import cn.edu.fudan.mybaits.ClientPullMessageLog;
import cn.edu.fudan.mybaits.ClientPullMessageLogDao;
import cn.edu.fudan.mybaits.EntityOperation;
import cn.edu.fudan.mybaits.Issue;
import cn.edu.fudan.mybaits.MessageLog;

import com.sun.corba.se.impl.protocol.giopmsgheaders.Message;

/**
 * Servlet implementation class saveMessage
 */
@WebServlet("/ClientPullMessage")
public class ClientPullMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ClientPullMessage() {
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
		JSONObject operateJSON = JSONObject.fromObject(request.getParameter("message"));
		System.out.println(operateJSON.toString());
		
		String date = (String) operateJSON.get("date");
		String city = (String) operateJSON.get("city");
		String group = (String) operateJSON.get("group");
		String type = (String) operateJSON.get("type");
		int lastUpdateId = operateJSON.getInt("lastUpdateId");
		JSONObject json = new JSONObject();
		List<ClientPullMessageLog> messageLogs = ClientPullMessageLog.getItineraryByMapInfo(date, city, group, lastUpdateId);
		if(type.equals("getMessageLog")) {
			
		} else {
			int timestamp = operateJSON.getInt("timestamp");
			String user = (String) operateJSON.get("user");
			String start = "";
			if (type.equals("addPOI") || type.equals("deletePOI")
					|| type.equals("addLine") || type.equals("deleteLine")
					|| type.equals("voteLine") || type.equals("updatePOI"))
				start = operateJSON.get("start").toString();
			String end = "";
			if (type.equals("addLine") || type.equals("deleteLine")
					|| type.equals("voteLine") || type.equals("updatePOI"))
				end = operateJSON.get("end").toString();
			String title = (String) operateJSON.get("title");
			String content = (String) operateJSON.get("content");

			Date nowDate = new Date();
			Timestamp receiveTime = new Timestamp(nowDate.getTime());
			
			System.out.println(timestamp + " " + date + " " + city + " "
					+ group + " " + user + " " + type + " " + start + " " + end
					+ " " + title + " " + content + " " + lastUpdateId + " "
					+ receiveTime);
			
			ClientPullMessageLog messageLog = new ClientPullMessageLog(timestamp, date, city,
					group, user, type, start, end, title, content,
					lastUpdateId, receiveTime);
			EntityOperation operation = messageLog;
			int id = operation.save();
			messageLog.setType("ack");
			messageLog.setId(id);
			messageLogs.add(messageLog);
		}
		json.put("result", true);
		json.put("list", messageLogs);
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
