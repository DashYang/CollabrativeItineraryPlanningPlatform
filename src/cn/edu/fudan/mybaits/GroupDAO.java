package cn.edu.fudan.mybaits;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

/**
 * @author dash
 * @version 1.0 date 2015-7-20
 * @since JDK1.6
 */
public interface GroupDAO {
	@Insert("insert into groups (`name`,`description`)"
			+ " values (#{name},#{description})")
	public int insert(Group group);
	
	@Select("select * from groups")
	public List<Group> getList();
	
	@Select("select * from groups where id=#{id}")
	public Group getGroupById(int id);
}
