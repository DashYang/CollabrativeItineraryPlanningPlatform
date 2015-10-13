package cn.edu.fudan.mybaits;

import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

/**
 * @author dash
 * @version 1.0 date 2015-7-20
 * @since JDK1.6
 */
public class Group implements EntityOperation{
	private Integer id;
	private String name;
	private String description;
	
	public int getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
	public Group(){
		this.id = 0;
		this.name = "";
		this.description = "";
	}
	
	public Group(String name, String description) {
		super();
		this.name = name;
		this.description = description;
	}
	
	@Override
	public int save() {
		int flag = 0;
		try {
			SqlSession session = DAOManager.getSession();
			GroupDAO groupDAO = session.getMapper(GroupDAO.class);
			Group group = (Group) this;
			flag = groupDAO.insert(group);

			session.commit();
			session.close();
		} catch (Exception e) {
			flag = 0;
			System.out.println(e.toString());
		}
		return flag;
	}
	
	public static List<Group> getList() {
		List<Group> list = new LinkedList<Group>();
		try {
			SqlSession session = DAOManager.getSession();
			GroupDAO groupDAO = session.getMapper(GroupDAO.class);
			list = groupDAO.getList();

			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return list;
	}
	
	public static Group getGroupById(int id) {
		Group group = new Group();
		try {
			SqlSession session = DAOManager.getSession();
			GroupDAO groupDAO = session.getMapper(GroupDAO.class);
			group = groupDAO.getGroupById(id);

			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return group;
	}
}
