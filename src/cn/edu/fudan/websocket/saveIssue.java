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

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * Servlet implementation class saveIssue
 */
@WebServlet("/saveIssue")
public class saveIssue extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public saveIssue() {
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
		String username = request.getParameter("username");
		String content = request.getParameter("content");
		String type = request.getParameter("type");
		System.out.println(type);
		if (type.equals("saveIssue")) {
			JSONObject json = new JSONObject();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式

			String date = df.format(new Date());
			System.out.println(username + ":" + content + ":" + date);
			Issue issue = new Issue(username, content, date);
			EntityOperation operation = (EntityOperation) issue;
			operation.save();
			json.put("result", true);

			PrintWriter pw = response.getWriter();
			pw.print(json.toString());

			pw.close();
		} else {
			JSONObject json = new JSONObject();
			List<Issue> issues = Issue.getList();
			String listContent = "";
			for(Issue issue : issues) {
				listContent += issue.getUsername() + " 于 " + issue.getDate() + " <br> " + issue.getContent() + "<br>";
			}
			System.out.println(listContent);
			json.put("result", true);
			json.put("list", listContent);
			PrintWriter pw = response.getWriter();
			pw.print(json.toString());
			
			pw.close();
		}
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
