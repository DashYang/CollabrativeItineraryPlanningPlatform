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
import cn.edu.fudan.mybaits.Group;
import cn.edu.fudan.mybaits.Issue;

import com.alibaba.fastjson.JSONObject;

/**
 * Servlet implementation class saveGroup
 */
@WebServlet("/saveGroup")
public class saveGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public saveGroup() {
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
		if (type.equals("saveGroup")) {
			String name = request.getParameter("name");
			String description = request.getParameter("description");
			
			JSONObject json = new JSONObject();
			Group group = new Group(name, description);
			EntityOperation operation = (EntityOperation) group;
			operation.save();
			json.put("result", true);

			PrintWriter pw = response.getWriter();
			pw.print(json.toString());

			pw.close();
		} else if(type.equals("getGroups")){
			JSONObject json = new JSONObject();
			List<Group> groups = Group.getList();
			json.put("result", true);
			json.put("list", groups);
			PrintWriter pw = response.getWriter();
			pw.print(json.toString());
			
			pw.close();
		} else if(type.equals("getGroupById")) {
			JSONObject json = new JSONObject();
			int groupId = Integer.parseInt(request.getParameter("groupId"));
			Group group = Group.getGroupById(groupId);
			json.put("result", true);
			json.put("group", group);
			System.out.println(group.getName());
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
