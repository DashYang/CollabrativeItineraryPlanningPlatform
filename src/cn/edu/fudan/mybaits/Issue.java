package cn.edu.fudan.mybaits;

import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;


/**
 * 
 * @author dash
 * comments 
 */
public class Issue implements EntityOperation{
	private int id;
	private String username;
	private String content;
	private String date;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	public Issue() {
		super();
		this.id = 0;
		this.username = "";
		this.content = "";
		this.date = "";
	}

	public Issue(String username, String content, String date) {
		super();
		this.username = username;
		this.content = content;
		this.date = date;
	}

	public void print(){
		System.out.println("id:"+getId());
		System.out.println("name:"+getUsername());
		System.out.println("date:" + getDate());
		System.out.println("content:" + getContent());
	}
	
	@Override
	public int save() {
		int flag = 0;
		try {
			SqlSession session = DAOManager.getSession();
			IssueDAO issueDAO = session.getMapper(IssueDAO.class);
			Issue issue = (Issue) this;
			flag = issueDAO.insert(issue);

			session.commit();
			session.close();
		} catch (Exception e) {
			flag = 0;
			System.out.println(e.toString());
		}
		return flag;
	}

	public static List<Issue> getList() {
		List<Issue> list = new LinkedList<Issue>();
		try {
			SqlSession session = DAOManager.getSession();
			IssueDAO issueDAO = session.getMapper(IssueDAO.class);
			list = issueDAO.getList();

			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return list;
	}
	
}
